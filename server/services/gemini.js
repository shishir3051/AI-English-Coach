import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY missing in .env');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const MODES = {
  Beginner:
    'Speak simply. Short sentences. Explain grammar clearly.',

  Intermediate:
    'Speak naturally and conversationally. Improve grammar gently.',

  Advanced:
    'Use advanced vocabulary and challenge the learner.',

  IELTS:
    'Act as IELTS examiner and provide scoring.',

  Kids:
    'Be playful and easy to understand.',

  Professional:
    'Focus on business English and professional communication.',

  'Fast Speaking':
    'Use conversational English and natural speaking rhythm.'
};

function cleanJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

async function safeGenerate(fn, retry = 2) {
  try {
    return await fn();
  } catch (err) {
    console.error('Gemini Retry:', err.message);

    if (retry > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return safeGenerate(fn, retry - 1);
    }

    throw err;
  }
}

export async function getCoachResponse({
  message,
  history = [],
  mode = 'Intermediate',
  userLevel = 'Beginner'
}) {
  try {
    const model = genAI.getGenerativeModel({
      // ✅ FIX
      model: 'gemini-2.5-flash'
    });

    const systemInstruction = `
You are AI English Coach.

Mode:
${MODES[mode]}

User Level:
${userLevel}

Return ONLY JSON.

{
 "reply":"",
 "correction":{
   "original":"",
   "corrected":"",
   "explanation":"",
   "betterNative":"",
   "pronunciationTips":"",
   "vocabularyUpgrade":"",
   "confidenceScore":80,
   "motivation":""
 }
}

If no correction needed:
"correction": null
`;

    const contents = history.map(item => ({
      role: item.role === 'assistant'
        ? 'model'
        : 'user',
      parts: [
        {
          text: item.content
        }
      ]
    }));

    contents.push({
      role: 'user',
      parts: [
        {
          text: message
        }
      ]
    });

    const result = await safeGenerate(() =>
      model.generateContent({
        systemInstruction,
        contents
      })
    );

    const text = result.response.text();

    console.log('RAW GEMINI:\n', text);

    const parsed = cleanJSON(text);

    if (!parsed) {
      return {
        reply: text,
        correction: null
      };
    }

    return {
      reply:
        parsed.reply ||
        'I am here to help you learn English.',

      correction:
        parsed.correction || null
    };
  } catch (error) {
    console.error(
      'FULL GEMINI ERROR',
      error
    );

    return {
      reply:
        "I'm having trouble connecting to AI right now. Please try again in a moment.",

      correction: null
    };
  }
}

export async function analyzeWriting(text) {
  return {
    correctedText: text,
    errors: [],
    structuralAnalysis: '',
    betterNativeVersion: '',
    vocabularyUpgrades: [],
    scores: {
      grammar: 80,
      vocabulary: 80,
      coherence: 80,
      overall: 80
    },
    motivation: 'Keep improving.'
  };
}

export async function analyzePronunciation(text) {
  return {
    ipa: '',
    syllables: '',
    stressPattern: '',
    mouthPositioning: '',
    commonMistakes: '',
    audioTips: '',
    practiceExercises: [text]
  };
}