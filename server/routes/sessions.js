import express from 'express';
import mongoose from 'mongoose';
import ChatSession from '../models/ChatSession.js';

const router = express.Router();

// GET /api/sessions?userId=xxx&mode=xxx — get active session for user+mode
router.get('/', async (req, res) => {
  const { mode } = req.query;
  const userId = req.user.id;
  try {
    const query = { userId, isActive: true };
    if (mode) query.mode = mode;

    const session = await ChatSession.findOne(query).sort({ updatedAt: -1 });
    res.json(session || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session', details: error.message });
  }
});

// POST /api/sessions — create a new session
router.post('/', async (req, res) => {
  const { mode = 'Intermediate' } = req.body;
  const userId = req.user.id;

  if (mongoose.connection.readyState !== 1) {
    return res.status(201).json({
      _id: `local-${Date.now()}`,
      userId,
      mode,
      messages: [],
      isActive: true,
    });
  }

  try {
    // Close any existing active sessions for same user+mode
    await ChatSession.updateMany({ userId, mode, isActive: true }, { isActive: false });

    const session = new ChatSession({ userId, mode, messages: [] });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session', details: error.message });
  }
});

// POST /api/sessions/:id/messages — append a message to session
router.post('/:id/messages', async (req, res) => {
  const { role, content, correction } = req.body;
  if (!role || !content) {
    return res.status(400).json({ error: 'role and content are required' });
  }
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.messages.push({ role, content, correction: correction || null });
    await session.save();
    res.json({ success: true, message: session.messages[session.messages.length - 1] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message', details: error.message });
  }
});

// GET /api/sessions/:id — get session with all messages
router.get('/:id', async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session', details: error.message });
  }
});

// GET /api/sessions/history/:userId — sessions where the user actually chatted
router.get('/history/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id; // Override with authenticated user id

    if (mongoose.connection.readyState === 1) {
      await ChatSession.deleteMany({
        userId,
        $or: [
          { messages: { $size: 0 } },
          { messages: { $not: { $elemMatch: { role: 'user' } } } },
        ],
      });
    }

    const sessions = await ChatSession.find({
      userId,
      messages: { $elemMatch: { role: 'user' } },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('mode messages updatedAt isActive');

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history', details: error.message });
  }
});

// DELETE /api/sessions/:id — close/delete a session
router.delete('/:id', async (req, res) => {
  try {
    await ChatSession.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close session', details: error.message });
  }
});

export default router;
