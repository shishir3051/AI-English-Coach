import express from 'express';
import ChatSession from '../models/ChatSession.js';
import {
  getCoachResponse,
  transcribeAudio,
  analyzeWriting,
} from '../services/gemini.js';
import {
  getOrCreateProgress,
  updateActivityStreak,
  recordIeltsAttempt,
} from '../utils/progressHelpers.js';

const router = express.Router();

router.get('/transcribe', (_req, res) => {
  res.json({ available: true });
});

router.post('/transcribe', async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio?.trim()) {
      return res.status(400).json({ error: 'Audio data required' });
    }
    const text = await transcribeAudio(audio, mimeType || 'audio/webm');
    return res.json({ text });
  } catch (err) {
    console.error('Transcribe error:', err.message);
    return res.status(500).json({
      error: 'Could not transcribe audio. Check GEMINI_API_KEY and try again.',
    });
  }
});

router.post('/analyze-writing', async (req, res) => {
  try {
    const { text, taskType = 'task2' } = req.body;
    const userId = req.user.id;
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Text required' });
    }

    const analysis = await analyzeWriting(text.trim(), taskType);
    const progress = await getOrCreateProgress(userId);

    progress.writingAttempts = progress.writingAttempts || [];
    progress.writingAttempts.push({
      taskType,
      wordCount: text.trim().split(/\s+/).length,
      bands: analysis.bands,
      scores: analysis.scores,
    });

    recordIeltsAttempt(progress, {
      skill: 'writing',
      taskType,
      bands: analysis.bands,
      feedback: analysis.structuralAnalysis,
    });

    await updateActivityStreak(progress);
    await progress.save();

    return res.json({
      ...analysis,
      ielts: progress.ielts,
    });
  } catch (err) {
    console.error('analyze-writing error:', err.message);
    return res.status(500).json({ error: 'Writing analysis failed', details: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      mode = 'Intermediate',
      sessionId,
      ieltsAction,
    } = req.body;
    const userId = req.user.id;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message required' });
    }

    const progress = await getOrCreateProgress(userId);

    let session = null;
    if (sessionId) {
      session = await ChatSession.findById(sessionId);
    }
    if (!session) {
      session = await ChatSession.create({
        userId,
        mode,
        messages: [],
        ieltsMock: mode === 'IELTS' ? { currentPart: 1, questionIndex: 0, phase: 'questioning' } : undefined,
      });
    }

    const ieltsContext =
      mode === 'IELTS' && session.ieltsMock
        ? session.ieltsMock.toObject?.() || session.ieltsMock
        : null;

    if (mode === 'IELTS' && ieltsAction === 'finish_mock' && session.ieltsMock) {
      const bands = session.ieltsMock.lastBands || { overall: 6, fluency: 6, lexical: 6, grammar: 6, pronunciation: 6 };
      recordIeltsAttempt(progress, {
        skill: 'speaking',
        taskType: 'full_mock',
        bands,
        feedback: 'IELTS speaking mock completed',
      });
      session.ieltsMock.phase = 'completed';
      session.messages.push({ role: 'user', content: message });
      session.messages.push({
        role: 'assistant',
        content: `Thank you. Your IELTS speaking mock is complete. Estimated overall band: ${bands.overall ?? 6}. Keep practicing Parts 1–3 regularly.`,
        ieltsBands: bands,
        speakingPart: session.ieltsMock.currentPart,
      });
      await session.save();
      await updateActivityStreak(progress);
      await progress.save();
      return res.json({
        reply: `Thank you. Your IELTS speaking mock is complete. Estimated overall band: ${bands.overall ?? 6}.`,
        correction: null,
        bands,
        speakingPart: session.ieltsMock.currentPart,
        sessionId: session._id,
        ieltsMock: session.ieltsMock,
        ielts: progress.ielts,
        streak: progress.streak,
        confidenceScore: progress.confidenceScore,
      });
    }

    const ai = await getCoachResponse({
      message,
      history,
      mode,
      userLevel: progress.level || 'Intermediate',
      ieltsContext,
    });

    if (mode === 'IELTS' && session.ieltsMock) {
      if (ai.speakingPart) session.ieltsMock.currentPart = ai.speakingPart;
      if (ai.bands) session.ieltsMock.lastBands = ai.bands;
      if (ai.nextQuestion) session.ieltsMock.questionIndex = (session.ieltsMock.questionIndex || 0) + 1;
      if (ai.cueCard) session.ieltsMock.cueCard = ai.cueCard;
      if (ai.speakingPart === 2 && !session.ieltsMock.cueCard && ai.reply) {
        session.ieltsMock.cueCard = ai.reply.slice(0, 500);
      }
      if (ai.speakingPart === 2) session.ieltsMock.phase = 'part2';
      if (ai.speakingPart === 3) session.ieltsMock.phase = 'part3';
    }

    const assistantPayload = {
      role: 'assistant',
      content: ai.reply || 'No response',
      correction: ai.correction || null,
      ieltsBands: ai.bands || null,
      speakingPart: ai.speakingPart,
      examinerNotes: ai.examinerNotes,
    };

    const greetingOnly =
      session.messages.length > 0 &&
      !session.messages.some((m) => m.role === 'user');
    if (greetingOnly) {
      session.messages = [];
    }

    session.messages.push({ role: 'user', content: message });
    session.messages.push(assistantPayload);
    await session.save();

    if (ai.correction) {
      progress.correctionsCount = (progress.correctionsCount || 0) + 1;
      progress.corrections.push({
        original: ai.correction.original,
        corrected: ai.correction.corrected,
        explanation: ai.correction.explanation,
        betterNative: ai.correction.betterNative,
        confidenceScore: ai.correction.confidenceScore || 0,
      });
      progress.confidenceScore = ai.correction.confidenceScore || progress.confidenceScore;
    }

    if (mode === 'IELTS' && ai.bands) {
      recordIeltsAttempt(progress, {
        skill: 'speaking',
        taskType: `part_${ai.speakingPart || session.ieltsMock?.currentPart || 1}`,
        bands: ai.bands,
        feedback: ai.examinerNotes || '',
      });
    }

    await updateActivityStreak(progress);
    await progress.save();

    return res.json({
      reply: ai.reply,
      correction: ai.correction,
      bands: ai.bands,
      speakingPart: ai.speakingPart,
      examinerNotes: ai.examinerNotes,
      nextQuestion: ai.nextQuestion,
      sessionId: session._id,
      ieltsMock: session.ieltsMock,
      streak: progress.streak,
      level: progress.level,
      confidenceScore: progress.confidenceScore,
      ielts: progress.ielts,
    });
  } catch (err) {
    console.log('CHAT ERROR:', err);
    return res.status(200).json({
      reply: 'Sorry, AI is busy now. Try again.',
      correction: null,
    });
  }
});

export default router;
