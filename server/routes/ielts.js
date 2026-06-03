import express from 'express';
import mongoose from 'mongoose';
import IeltsListeningTest from '../models/IeltsListeningTest.js';
import IeltsReadingTest from '../models/IeltsReadingTest.js';
import IeltsWritingPrompt from '../models/IeltsWritingPrompt.js';
import { collectIeltsContent, importIeltsTestsToDb } from '../lib/ieltsImport.js';
import {
  getOrCreateProgress,
  updateActivityStreak,
  recordIeltsAttempt,
} from '../utils/progressHelpers.js';

const router = express.Router();

let dbImportPromise = null;

async function ensureIeltsInDb() {
  if (mongoose.connection.readyState !== 1) return false;
  const count = await IeltsListeningTest.countDocuments();
  if (count > 0) return true;
  if (!dbImportPromise) {
    dbImportPromise = importIeltsTestsToDb().catch((err) => {
      dbImportPromise = null;
      throw err;
    });
  }
  await dbImportPromise;
  return true;
}

function offlineListening() {
  return collectIeltsContent().listening.map(({ testId, title, questions }) => ({
    testId,
    title,
    questionCount: questions?.length || 0,
  }));
}

function offlineReading() {
  return collectIeltsContent().reading.map(({ testId, title, questions }) => ({
    testId,
    title,
    questionCount: questions?.length || 0,
  }));
}

function listeningBand(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 8.5;
  if (pct >= 0.8) return 7.5;
  if (pct >= 0.7) return 6.5;
  if (pct >= 0.6) return 5.5;
  if (pct >= 0.5) return 4.5;
  return 3.5;
}

function readingBand(correct, total) {
  return listeningBand(correct, total);
}

// POST /api/ielts/import — re-load all tests from seed + JSON files (after you add new files)
router.post('/import', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB not connected' });
    }
    dbImportPromise = null;
    const stats = await importIeltsTestsToDb();
    res.json({ success: true, ...stats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ielts/listening
router.get('/listening', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(offlineListening());
    }
    await ensureIeltsInDb();
    const tests = await IeltsListeningTest.find().select('testId title questions').sort({ testId: 1 });
    res.json(
      tests.map((t) => ({
        testId: t.testId,
        title: t.title,
        questionCount: t.questions?.length || 0,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/listening/:testId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const t = collectIeltsContent().listening.find((x) => x.testId === req.params.testId);
      if (!t) return res.status(404).json({ error: 'Test not found' });
      const { questions, ...rest } = t;
      return res.json({
        ...rest,
        questions: questions.map(({ id, type, question, options }) => ({
          id,
          type,
          question,
          options,
        })),
      });
    }
    await ensureIeltsInDb();
    const test = await IeltsListeningTest.findOne({ testId: req.params.testId });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({
      testId: test.testId,
      title: test.title,
      audioUrl: test.audioUrl,
      transcript: test.transcript,
      questions: test.questions.map(({ id, type, question, options }) => ({
        id,
        type,
        question,
        options,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/listening/:testId/submit', async (req, res) => {
  try {
    const { answers = {}, userId = 'default_user' } = req.body;
    let test =
      mongoose.connection.readyState === 1
        ? await IeltsListeningTest.findOne({ testId: req.params.testId })
        : collectIeltsContent().listening.find((x) => x.testId === req.params.testId);
    if (!test && mongoose.connection.readyState === 1) {
      await importIeltsTestsToDb();
      test = await IeltsListeningTest.findOne({ testId: req.params.testId });
    }
    if (!test) return res.status(404).json({ error: 'Test not found' });

    let correct = 0;
    const results = test.questions.map((q) => {
      const userAns = answers[q.id];
      const ok = Number(userAns) === q.answer;
      if (ok) correct += 1;
      return { id: q.id, correct: ok, correctAnswer: q.answer };
    });

    const band = listeningBand(correct, test.questions.length);
    const progress = await getOrCreateProgress(userId);
    recordIeltsAttempt(progress, {
      skill: 'listening',
      taskType: test.testId,
      bands: { overall: band, rawScore: correct, total: test.questions.length },
      feedback: `Scored ${correct}/${test.questions.length}`,
    });
    await updateActivityStreak(progress);
    await progress.save();

    res.json({ correct, total: test.questions.length, band, results, ielts: progress.ielts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/reading', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(offlineReading());
    }
    await ensureIeltsInDb();
    const tests = await IeltsReadingTest.find().select('testId title questions').sort({ testId: 1 });
    res.json(
      tests.map((t) => ({
        testId: t.testId,
        title: t.title,
        questionCount: t.questions?.length || 0,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/reading/:testId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const t = collectIeltsContent().reading.find((x) => x.testId === req.params.testId);
      if (!t) return res.status(404).json({ error: 'Test not found' });
      return res.json({
        testId: t.testId,
        title: t.title,
        passages: t.passages,
        questions: t.questions.map(({ id, passageIndex, question, options }) => ({
          id,
          passageIndex,
          question,
          options,
        })),
      });
    }
    await ensureIeltsInDb();
    const test = await IeltsReadingTest.findOne({ testId: req.params.testId });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({
      testId: test.testId,
      title: test.title,
      passages: test.passages,
      questions: test.questions.map(({ id, passageIndex, question, options }) => ({
        id,
        passageIndex,
        question,
        options,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/reading/:testId/submit', async (req, res) => {
  try {
    const { answers = {}, userId = 'default_user' } = req.body;
    let test =
      mongoose.connection.readyState === 1
        ? await IeltsReadingTest.findOne({ testId: req.params.testId })
        : collectIeltsContent().reading.find((x) => x.testId === req.params.testId);
    if (!test && mongoose.connection.readyState === 1) {
      await importIeltsTestsToDb();
      test = await IeltsReadingTest.findOne({ testId: req.params.testId });
    }
    if (!test) return res.status(404).json({ error: 'Test not found' });

    let correct = 0;
    const results = test.questions.map((q) => {
      const ok = Number(answers[q.id]) === q.answer;
      if (ok) correct += 1;
      return { id: q.id, correct: ok, correctAnswer: q.answer };
    });

    const band = readingBand(correct, test.questions.length);
    const progress = await getOrCreateProgress(userId);
    recordIeltsAttempt(progress, {
      skill: 'reading',
      taskType: test.testId,
      bands: { overall: band, rawScore: correct, total: test.questions.length },
      feedback: `Scored ${correct}/${test.questions.length}`,
    });
    await updateActivityStreak(progress);
    await progress.save();

    res.json({ correct, total: test.questions.length, band, results, ielts: progress.ielts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/writing-prompts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(collectIeltsContent().writing);
    }
    await ensureIeltsInDb();
    const prompts = await IeltsWritingPrompt.find().sort({ taskType: 1 });
    res.json(prompts);
  } catch (e) {
    res.json(collectIeltsContent().writing);
  }
});

export default router;
