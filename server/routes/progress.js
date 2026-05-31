import express from 'express';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// GET /api/progress
router.get('/', async (req, res) => {
  const { userId = 'default_user' } = req.query;

  try {
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve progress data', details: error.message });
  }
});

// POST /api/progress/level
router.post('/level', async (req, res) => {
  const { level, userId = 'default_user' } = req.body;

  if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
    return res.status(400).json({ error: 'Invalid level value' });
  }

  try {
    let progress = await UserProgress.findOne({ userId });
    if (!progress) progress = new UserProgress({ userId });

    progress.level = level;
    await progress.save();

    res.json({ success: true, level: progress.level });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill level', details: error.message });
  }
});

// POST /api/progress/quiz
router.post('/quiz', async (req, res) => {
  const { topicId, topicName, score, totalQuestions, userId = 'default_user' } = req.body;

  if (!topicId || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'Missing quiz details' });
  }

  try {
    let progress = await UserProgress.findOne({ userId });
    if (!progress) progress = new UserProgress({ userId });

    progress.quizzes.push({ topicId, topicName, score, totalQuestions });
    await progress.save();

    res.json({ success: true, quizzes: progress.quizzes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz results', details: error.message });
  }
});

// POST /api/progress/challenge
router.post('/challenge', async (req, res) => {
  const { type, score, userId = 'default_user' } = req.body;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    let progress = await UserProgress.findOne({ userId });
    if (!progress) progress = new UserProgress({ userId });

    // Avoid double counting same challenge type on the same day
    const alreadyDone = progress.completedChallenges.some(c => c.date === todayStr && c.type === type);
    if (alreadyDone) {
      return res.status(400).json({ error: 'Challenge already completed today' });
    }

    progress.completedChallenges.push({
      date: todayStr,
      type,
      score
    });
    
    // Reward points towards streak/confidence
    progress.confidenceScore = Math.min(100, progress.confidenceScore + 1);

    await progress.save();
    res.json({ success: true, completedChallenges: progress.completedChallenges, confidenceScore: progress.confidenceScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete daily challenge', details: error.message });
  }
});

// POST /api/progress/word
router.post('/word', async (req, res) => {
  const { word, meaning, pronunciation, example, userId = 'default_user' } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'Word and meaning are required' });
  }

  try {
    let progress = await UserProgress.findOne({ userId });
    if (!progress) progress = new UserProgress({ userId });

    // Avoid duplicate words
    const exists = progress.wordsLearned.some(w => w.word.toLowerCase() === word.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: 'Word already exists in your vocabulary bank' });
    }

    progress.wordsLearned.push({ word, meaning, pronunciation, example });
    await progress.save();

    res.json({ success: true, words: progress.wordsLearned });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save custom word', details: error.message });
  }
});

export default router;
