import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import ChatSession from '../models/ChatSession.js';
import Vocabulary from '../models/Vocabulary.js';

const router = express.Router();


// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    // Some basic overall stats across all users
    const totalSessions = await ChatSession.countDocuments();
    
    // Optionally aggregate total words learned
    const progressDocs = await UserProgress.find({}, 'wordsLearned correctionsCount quizzes');
    let totalWordsLearned = 0;
    let totalCorrections = 0;
    let totalQuizzesTaken = 0;

    progressDocs.forEach(p => {
      totalWordsLearned += p.wordsLearned?.length || 0;
      totalCorrections += p.correctionsCount || 0;
      totalQuizzesTaken += p.quizzes?.length || 0;
    });

    res.json({
      totalUsers,
      verifiedUsers,
      totalSessions,
      totalWordsLearned,
      totalCorrections,
      totalQuizzesTaken
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent removing the last admin (basic safeguard)
    if (user.role === 'admin' && role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot demote the only admin.' });
      }
    }

    user.role = role;
    await user.save();
    
    res.json({ success: true, message: `Role updated to ${role}`, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role', details: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the only admin.' });
      }
    }

    // Clean up related data
    await UserProgress.findOneAndDelete({ userId: user._id.toString() });
    await ChatSession.deleteMany({ userId: user._id.toString() });
    
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});



// ─────────────────────────────────────────────
// USER ACTIVITY MONITORING (Admin only)
// ─────────────────────────────────────────────

// @route   GET /api/admin/users/:id/activity
// @desc    Get detailed user progress and session list
// @access  Private/Admin
router.get('/users/:id/activity', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Fetch progress
    const progress = await UserProgress.findOne({ userId });
    
    // Fetch sessions (metadata only, sort newest first)
    const sessions = await ChatSession.find({ userId })
      .select('-messages')
      .sort({ updatedAt: -1 })
      .limit(50); // limit to last 50 for performance

    res.json({ progress, sessions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity', details: error.message });
  }
});

// @route   GET /api/admin/sessions/:sessionId
// @desc    Get a specific chat session with full messages
// @access  Private/Admin
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat session', details: error.message });
  }
});


// GET /api/admin/vocab?page=1&limit=20&search=word
router.get('/vocab', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search?.trim();

    const query = search
      ? { english: { $regex: search, $options: 'i' } }
      : {};

    const total = await Vocabulary.countDocuments(query);
    const words = await Vocabulary.find(query)
      .sort({ english: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ words, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vocabulary', details: error.message });
  }
});

// POST /api/admin/vocab — Add a new word
router.post('/vocab', async (req, res) => {
  try {
    const { english, bangla, pronunciation, partOfSpeech, example, exampleBangla, category, difficulty, synonyms, antonyms } = req.body;
    if (!english || !bangla || !category) {
      return res.status(400).json({ error: 'english, bangla, and category are required' });
    }
    const existing = await Vocabulary.findOne({ english: new RegExp(`^${english}$`, 'i') });
    if (existing) return res.status(400).json({ error: 'This word already exists in the dictionary' });

    const word = await Vocabulary.create({
      english: english.trim(),
      bangla: bangla.trim(),
      pronunciation: pronunciation || '',
      partOfSpeech: partOfSpeech || 'noun',
      example: example || '',
      exampleBangla: exampleBangla || '',
      category: category.trim(),
      difficulty: difficulty || 'beginner',
      synonyms: synonyms || [],
      antonyms: antonyms || [],
    });
    res.status(201).json({ success: true, word });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add word', details: error.message });
  }
});

// PUT /api/admin/vocab/:id — Update an existing word
router.put('/vocab/:id', async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json({ success: true, word });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update word', details: error.message });
  }
});

// DELETE /api/admin/vocab/:id — Delete a word
router.delete('/vocab/:id', async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json({ success: true, message: `"${word.english}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete word', details: error.message });
  }
});

export default router;
