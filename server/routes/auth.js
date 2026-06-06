import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      role: 'user', // first user could be made admin manually, or set logic here
    });

    if (user) {
      try {
        // Construct the verification URL
        const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;
        
        // HTML message
        const message = `
          <h2>Welcome to Lumina AI Coach!</h2>
          <p>Please verify your email address to activate your account by clicking the link below:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#6366f1;color:#ffffff;text-decoration:none;border-radius:5px;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${verifyUrl}</p>
        `;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          await sendEmail({
            email: user.email,
            subject: 'Lumina AI Coach - Verify Your Email',
            html: message,
          });
          res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
          });
        } else {
          // Fallback if EMAIL_USER or EMAIL_PASS is not set in .env
          console.log(`[MOCK EMAIL] Verify link: ${verifyUrl}`);
          res.status(201).json({
            message: 'User registered successfully. (Check server console for the verification link since email is not configured).',
          });
        }
      } catch (err) {
        console.error('Email sending failed:', err);
        // If email fails, user is created but not verified, could handle better by deleting user or allowing resend.
        res.status(500).json({ error: 'Account created, but email failed to send. Please contact support.' });
      }
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify email token
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(403).json({ error: 'Please verify your email before logging in.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#6366f1;color:#ffffff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email. The link will expire in 1 hour.</p>
    `;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendEmail({
        email: user.email,
        subject: 'Lumina AI Coach - Password Reset',
        html: message,
      });
      res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } else {
      console.log(`[MOCK EMAIL] Password Reset link: ${resetUrl}`);
      res.status(200).json({ message: 'Password reset link generated. (Check server console since email is not configured).' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;
