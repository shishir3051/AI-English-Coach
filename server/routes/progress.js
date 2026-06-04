import express from 'express';
import mongoose from 'mongoose';
import UserProgress from '../models/UserProgress.js';
import {
  updateActivityStreak,
  ensureIelts,
  recordIeltsAttempt,
  getOrCreateProgress,
} from '../utils/progressHelpers.js';

const router = express.Router();

const defaultProgress = (userId) => ({
  userId,
  level: 'Beginner',
  streak: 0,
  lastActive: null,
  confidenceScore: 0,
  correctionsCount: 0,
  wordsLearned: [],
  corrections: [],
  quizzes: [],
  writingAttempts: [],
  completedChallenges: [],
  ielts: {
    targetBand: 6.5,
    overallBand: 0,
    skills: {
      listening: { band: 0 },
      reading: { band: 0 },
      writing: { band: 0 },
      speaking: { band: 0 },
    },
    attempts: [],
  },
});

router.get('/', async (req, res) => {
  const userId = req.user.id;

  if (mongoose.connection.readyState !== 1) {
    return res.json(defaultProgress(userId));
  }

  try {
    const progress = await getOrCreateProgress(userId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve progress data', details: error.message });
  }
});

router.get('/ielts', async (req, res) => {
  const userId = req.user.id;
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(defaultProgress(userId).ielts);
    }
    const progress = await getOrCreateProgress(userId);
    const ielts = ensureIelts(progress);
    res.json({
      ...ielts.toObject?.() || ielts,
      attempts: (ielts.attempts || []).slice(-10).reverse(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/ielts/target', async (req, res) => {
  const { targetBand } = req.body;
  const userId = req.user.id;
  const band = Number(targetBand);
  if (!band || band < 4 || band > 9) {
    return res.status(400).json({ error: 'targetBand must be between 4 and 9' });
  }
  try {
    const progress = await getOrCreateProgress(userId);
    ensureIelts(progress).targetBand = band;
    await progress.save();
    res.json({ success: true, targetBand: band });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/ielts/attempt', async (req, res) => {
  const { skill, taskType, bands, feedback } = req.body;
  const userId = req.user.id;
  if (!skill) return res.status(400).json({ error: 'skill required' });
  try {
    const progress = await getOrCreateProgress(userId);
    recordIeltsAttempt(progress, { skill, taskType, bands, feedback });
    await updateActivityStreak(progress);
    await progress.save();
    res.json({ success: true, ielts: progress.ielts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/level', async (req, res) => {
  const { level } = req.body;
  const userId = req.user.id;

  if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
    return res.status(400).json({ error: 'Invalid level value' });
  }

  try {
    const progress = await getOrCreateProgress(userId);
    progress.level = level;
    await progress.save();
    res.json({ success: true, level: progress.level });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill level', details: error.message });
  }
});

router.post('/quiz', async (req, res) => {
  const { topicId, topicName, score, totalQuestions } = req.body;
  const userId = req.user.id;

  if (!topicId || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'Missing quiz details' });
  }

  try {
    const progress = await getOrCreateProgress(userId);
    const pct = Math.round((score / totalQuestions) * 100);
    const existing = progress.quizzes.find((q) => q.topicId === topicId);
    if (existing) {
      existing.score = Math.max(existing.score, score);
      existing.bestScore = Math.max(existing.bestScore || 0, pct);
      existing.totalQuestions = totalQuestions;
      existing.completedAt = new Date();
    } else {
      progress.quizzes.push({
        topicId,
        topicName,
        score,
        totalQuestions,
        bestScore: pct,
      });
    }
    progress.confidenceScore = Math.min(100, (progress.confidenceScore || 0) + 1);
    await updateActivityStreak(progress);
    await progress.save();
    res.json({
      success: true,
      quizzes: progress.quizzes,
      confidenceScore: progress.confidenceScore,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz results', details: error.message });
  }
});

router.post('/challenge', async (req, res) => {
  const { type, score } = req.body;
  const userId = req.user.id;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const progress = await getOrCreateProgress(userId);
    const alreadyDone = progress.completedChallenges.some(
      (c) => c.date === todayStr && c.type === type
    );
    if (alreadyDone) {
      return res.status(400).json({ error: 'Challenge already completed today' });
    }

    progress.completedChallenges.push({ date: todayStr, type, score });
    progress.confidenceScore = Math.min(100, (progress.confidenceScore || 0) + 1);
    await updateActivityStreak(progress);
    await progress.save();
    res.json({
      success: true,
      completedChallenges: progress.completedChallenges,
      confidenceScore: progress.confidenceScore,
      streak: progress.streak,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete daily challenge', details: error.message });
  }
});

router.post('/word', async (req, res) => {
  const { word, meaning, pronunciation, example } = req.body;
  const userId = req.user.id;

  const trimmedWord = String(word || '').trim();
  const trimmedMeaning = String(meaning || '').trim();

  if (!trimmedWord) {
    return res.status(400).json({ error: 'Word is required' });
  }
  if (!trimmedMeaning) {
    return res.status(400).json({ error: 'Meaning is required' });
  }

  try {
    const progress = await getOrCreateProgress(userId);
    const key = trimmedWord.toLowerCase();
    const existing = progress.wordsLearned.find(
      (w) => w.word?.toLowerCase() === key
    );

    if (existing) {
      existing.meaning = trimmedMeaning;
      existing.pronunciation = pronunciation || existing.pronunciation || '';
      existing.example = example || existing.example || '';
      existing.learnedAt = new Date();
      await progress.save();
      return res.json({
        success: true,
        alreadyExists: true,
        message: 'Word updated in your vocabulary bank',
        words: progress.wordsLearned,
      });
    }

    progress.wordsLearned.push({
      word: trimmedWord,
      meaning: trimmedMeaning,
      pronunciation: pronunciation || '',
      example: example || '',
    });
    await progress.save();
    res.json({
      success: true,
      alreadyExists: false,
      message: 'Word saved to your vocabulary bank',
      words: progress.wordsLearned,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save custom word', details: error.message });
  }
});

export default router;
