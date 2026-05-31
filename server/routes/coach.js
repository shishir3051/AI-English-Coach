import express from 'express';
import { getCoachResponse, analyzeWriting, analyzePronunciation } from '../services/gemini.js';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// Helper to update user activity streak
async function updateActivityStreak(progress) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  if (!progress.lastActive) {
    progress.streak = 1;
  } else {
    const lastActiveStr = progress.lastActive.toISOString().split('T')[0];
    const diffTime = Math.abs(now - progress.lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (lastActiveStr !== todayStr) {
      if (diffDays <= 1) {
        progress.streak += 1;
      } else {
        progress.streak = 1; // reset streak
      }
    }
  }
  progress.lastActive = now;
}

// POST /api/coach/chat
router.post('/chat', async (req, res) => {
  const { message, history = [], mode = 'Intermediate', userId = 'default_user' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 1. Get progress document
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
    }

    // 2. Fetch response from Gemini
    const result = await getCoachResponse({
      message,
      history,
      mode,
      userLevel: progress.level
    });

    // 3. Process corrections and update stats if correction is found
    if (result.correction) {
      progress.correctionsCount += 1;
      progress.corrections.push({
        original: result.correction.original,
        corrected: result.correction.corrected,
        explanation: result.correction.explanation,
        betterNative: result.correction.betterNative,
        confidenceScore: result.correction.confidenceScore
      });

      // Maintain rolling average of confidence scores
      const recentScores = progress.corrections.slice(-10).map(c => c.confidenceScore);
      progress.confidenceScore = Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length);

      // Parse upgraded vocab if provided and save it to learned words
      if (result.correction.vocabularyUpgrade) {
        const upgradeStr = result.correction.vocabularyUpgrade;
        // Check if vocab is an object with word or just string
        // We'll add it to wordsLearned if it looks like a word we can parse
        const match = upgradeStr.match(/([a-zA-Z\s]+)\s*\((.*?)\)/); // e.g. "eloquent (/ˈel.ə.kwənt/)"
        const wordVal = match ? match[1].trim() : upgradeStr.split(':')[0].trim();
        
        // Avoid duplicate words
        const exists = progress.wordsLearned.some(w => w.word.toLowerCase() === wordVal.toLowerCase());
        if (!exists && wordVal.length < 30) {
          progress.wordsLearned.push({
            word: wordVal,
            meaning: upgradeStr,
            pronunciation: match ? match[2] : '',
            example: 'See Gemini suggestion'
          });
        }
      }
    }

    // Update streak and save progress
    await updateActivityStreak(progress);
    await progress.save();

    res.json({
      reply: result.reply,
      correction: result.correction,
      streak: progress.streak,
      level: progress.level,
      confidenceScore: progress.confidenceScore
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat response', details: error.message });
  }
});

// POST /api/coach/analyze-writing
router.post('/analyze-writing', async (req, res) => {
  const { text, userId = 'default_user' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const analysis = await analyzeWriting(text);

    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
    }

    // Update stats based on analysis
    progress.correctionsCount += (analysis.errors || []).length;
    if (analysis.scores && analysis.scores.overall) {
      progress.confidenceScore = Math.round((progress.confidenceScore + analysis.scores.overall) / 2);
    }

    // Save vocab upgrade words
    if (analysis.vocabularyUpgrades && Array.isArray(analysis.vocabularyUpgrades)) {
      analysis.vocabularyUpgrades.forEach(v => {
        const exists = progress.wordsLearned.some(w => w.word.toLowerCase() === v.upgrade.toLowerCase());
        if (!exists) {
          progress.wordsLearned.push({
            word: v.upgrade,
            meaning: v.meaning,
            pronunciation: '',
            example: v.example
          });
        }
      });
    }

    await updateActivityStreak(progress);
    await progress.save();

    res.json(analysis);
  } catch (error) {
    console.error('Writing analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze writing sample', details: error.message });
  }
});

// POST /api/coach/pronunciation
router.post('/pronunciation', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text/Word is required' });
  }

  try {
    const analysis = await analyzePronunciation(text);
    res.json(analysis);
  } catch (error) {
    console.error('Pronunciation analyzer error:', error);
    res.status(500).json({ error: 'Failed to analyze pronunciation', details: error.message });
  }
});

export default router;
