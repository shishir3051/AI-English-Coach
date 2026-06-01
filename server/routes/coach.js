import express from 'express';
import ChatSession from '../models/ChatSession.js';
import UserProgress from '../models/UserProgress.js';
import { getCoachResponse } from '../services/gemini.js';

const router = express.Router();

async function updateActivityStreak(progress) {
  const now = new Date();

  if (!progress.lastActive) {
    progress.streak = 1;
  } else {
    const last = new Date(progress.lastActive);

    const diff =
      Math.floor(
        (now.setHours(0,0,0,0) -
          last.setHours(0,0,0,0)) /
          86400000
      );

    if (diff === 1) progress.streak += 1;
    else if (diff > 1) progress.streak = 1;
  }

  progress.lastActive = new Date();
}

router.post('/chat', async (req, res) => {
  try {
    const {
      message,
      history=[],
      mode='Intermediate',
      userId='default_user',
      sessionId
    } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        error:'Message required'
      });
    }

    let progress =
      await UserProgress.findOne({ userId });

    if (!progress) {
      progress =
        await UserProgress.create({
          userId
        });
    }

    let session = null;

    if (sessionId) {
      session =
        await ChatSession.findById(sessionId);
    }

    if (!session) {
      session =
        await ChatSession.create({
          userId,
          mode,
          messages:[]
        });
    }

    const ai =
      await getCoachResponse({
        message,
        history,
        mode,
        userLevel:
          progress.level ||
          'Intermediate'
      });

    session.messages.push({
      role:'user',
      content:message
    });

    session.messages.push({
      role:'assistant',
      content:
        ai.reply ||
        'No response',
      correction:
        ai.correction || null
    });

    await session.save();

    if (ai.correction) {

      progress.correctionsCount =
        (progress.correctionsCount||0)+1;

      progress.corrections.push({
        original:
          ai.correction.original,

        corrected:
          ai.correction.corrected,

        explanation:
          ai.correction.explanation,

        betterNative:
          ai.correction.betterNative,

        confidenceScore:
          ai.correction.confidenceScore||0
      });

      progress.confidenceScore =
        ai.correction.confidenceScore||0;
    }

    await updateActivityStreak(progress);

    await progress.save();

    return res.json({
      reply: ai.reply,
      correction: ai.correction,
      sessionId: session._id,
      streak: progress.streak,
      level: progress.level,
      confidenceScore:
        progress.confidenceScore
    });

  } catch (err) {

    console.log(
      'CHAT ERROR:',
      err
    );

    return res.status(200).json({
      reply:
        "Sorry, AI is busy now. Try again.",
      correction:null
    });
  }
});

export default router;