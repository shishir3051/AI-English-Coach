import express from 'express';
import CoachMode from '../models/CoachMode.js';

const router = express.Router();

const INITIAL_COACH_MODES = [
  {
    id: 'Beginner',
    title: 'Beginner Mode',
    desc: 'Simple, slow English, clear explanations.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Beginner mode. I will speak very simply. Tell me, how are you today?',
    order: 1
  },
  {
    id: 'Intermediate',
    title: 'Intermediate Mode',
    desc: 'Standard conversations, common idioms.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Intermediate mode. How\'s your day going? Let\'s practice talking about something fun!',
    order: 2
  },
  {
    id: 'Advanced',
    title: 'Advanced Mode',
    desc: 'Sophisticated debates, complex ideas.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Advanced mode. How\'s your day going? Let\'s practice talking about something fun!',
    order: 3
  },
  {
    id: 'IELTS',
    title: 'IELTS Mode',
    desc: 'Official IELTS Examiner grading simulation.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in IELTS mode. Welcome to the IELTS mock speaking assessment. I will act as your examiner. Let\'s begin Part 1. Can you tell me about your hometown?',
    order: 4
  },
  {
    id: 'Kids',
    title: 'Kids Mode',
    desc: 'Highly playful, interactive, simple terms.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Kids mode. How\'s your day going? Let\'s practice talking about something fun!',
    order: 5
  },
  {
    id: 'Professional',
    title: 'Professional Mode',
    desc: 'Business, interviews, emails, negotiating.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Professional mode. Welcome. Let\'s practice business communications or mock job interview scenarios. Ready to begin?',
    order: 6
  },
  {
    id: 'Fast Speaking',
    title: 'Fast Speaking Mode',
    desc: 'Quick replies, slangs, connected speech.',
    greetingTemplate: 'Hello! I am your AI English Coach. We are in Fast Speaking mode. Hey! Let\'s do a fast-paced sprint. Keep your answers quick. Ready?',
    order: 7
  }
];

// GET /api/coach-modes — list all modes (seed if empty)
router.get('/', async (req, res) => {
  try {
    let modes = await CoachMode.find().sort({ order: 1 });
    if (modes.length === 0) {
      await CoachMode.insertMany(INITIAL_COACH_MODES);
      modes = await CoachMode.find().sort({ order: 1 });
    }
    res.json(modes);
  } catch (error) {
    console.error('Coach modes fetch error:', error);
    res.json(INITIAL_COACH_MODES);
  }
});

// POST /api/coach-modes — add a custom mode
router.post('/', async (req, res) => {
  try {
    const mode = new CoachMode(req.body);
    await mode.save();
    res.status(201).json(mode);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create coach mode', details: error.message });
  }
});

// PUT /api/coach-modes/:id — update a mode
router.put('/:id', async (req, res) => {
  try {
    const mode = await CoachMode.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!mode) return res.status(404).json({ error: 'Mode not found' });
    res.json(mode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coach mode', details: error.message });
  }
});

// DELETE /api/coach-modes/:id
router.delete('/:id', async (req, res) => {
  try {
    await CoachMode.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coach mode', details: error.message });
  }
});

export default router;
