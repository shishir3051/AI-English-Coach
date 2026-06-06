import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set — AI features disabled');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const assertGenAI = () => {
  if (!genAI) throw new Error('GEMINI_API_KEY not configured');
};

const MODES = {
  Beginner: 'Speak simply. Short sentences. Explain grammar clearly.',
  Intermediate: 'Speak naturally and conversationally. Improve grammar gently.',
  Advanced: 'Use advanced vocabulary and challenge the learner.',
  IELTS: `You are a certified IELTS Speaking examiner. Follow official band descriptors.
- Part 1: short familiar topics (4-5 questions).
- Part 2: give a cue card, allow 1 min preparation, expect 2 min response.
- Part 3: abstract discussion linked to Part 2 theme.
Advance parts naturally. Ask one question at a time in Part 1/3.`,
  Kids: 'Be playful and easy to understand.',
  Professional: 'Focus on business English and professional communication.',
  'Fast Speaking': 'Use conversational English and natural speaking rhythm.',
};

function cleanJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
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
      await new Promise((r) => setTimeout(r, 2000));
      return safeGenerate(fn, retry - 1);
    }
    throw err;
  }
}

const IELTS_CHAT_JSON = `
Return ONLY JSON:
{
 "reply":"examiner response",
 "speakingPart":1,
 "cueCard":"Part 2 cue card text when entering part 2, else empty string",
 "nextQuestion":"optional follow-up question",
 "examinerNotes":"brief rubric notes",
 "bands":{
   "fluency":6.5,
   "lexical":6.5,
   "grammar":6.5,
   "pronunciation":6.5,
   "overall":6.5
 },
 "correction":{
   "original":"",
   "corrected":"",
   "explanation":"",
   "betterNative":"",
   "pronunciationTips":"",
   "vocabularyUpgrade":"",
   "confidenceScore":65,
   "motivation":""
 }
}
If no grammar correction needed, set correction to null. Bands must be 0-9 in 0.5 steps.`;

const STANDARD_CHAT_JSON = `
Return ONLY JSON:
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
If no correction needed: "correction": null`;

export async function getCoachResponse({
  message,
  history = [],
  mode = 'Intermediate',
  userLevel = 'Beginner',
  ieltsContext = null,
}) {
  assertGenAI();
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const isIelts = mode === 'IELTS';

    let contextBlock = '';
    if (isIelts && ieltsContext) {
      contextBlock = `
IELTS mock state:
- currentPart: ${ieltsContext.currentPart ?? 1}
- questionIndex: ${ieltsContext.questionIndex ?? 0}
- cueCard: ${ieltsContext.cueCard || 'none'}
- phase: ${ieltsContext.phase || 'questioning'}
`;
    }

    const systemInstruction = `
You are AI English Coach Lumina.
Mode: ${MODES[mode] || MODES.Intermediate}
User Level: ${userLevel}
${contextBlock}
${isIelts ? IELTS_CHAT_JSON : STANDARD_CHAT_JSON}`;

    const contents = history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await safeGenerate(() =>
      model.generateContent({ systemInstruction, contents })
    );

    const text = result.response.text();
    const parsed = cleanJSON(text);

    if (!parsed) {
      return { reply: text, correction: null, bands: null, speakingPart: null };
    }

    return {
      reply: parsed.reply || 'I am here to help you learn English.',
      correction: parsed.correction || null,
      bands: parsed.bands || null,
      speakingPart: parsed.speakingPart ?? null,
      cueCard: parsed.cueCard || null,
      nextQuestion: parsed.nextQuestion || null,
      examinerNotes: parsed.examinerNotes || null,
    };
  } catch (error) {
    console.error('FULL GEMINI ERROR', error);
    return {
      reply: "I'm having trouble connecting to AI right now. Please try again in a moment.",
      correction: null,
      bands: null,
    };
  }
}

export async function analyzeWriting(text, taskType = 'task2') {
  assertGenAI();
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const taskGuide = {
      task1_academic: 'IELTS Academic Writing Task 1 (graph/chart/report).',
      task1_general: 'IELTS General Training Task 1 (letter).',
      task2: 'IELTS Writing Task 2 (essay, 250+ words).',
      general: 'General English writing.',
    };

    const prompt = `
You are an IELTS Writing examiner. Analyze this ${taskGuide[taskType] || taskGuide.general}

Return ONLY JSON:
{
  "correctedText":"",
  "errors":[{"original":"","corrected":"","type":"grammar","explanation":""}],
  "structuralAnalysis":"",
  "betterNativeVersion":"",
  "vocabularyUpgrades":[{"originalWord":"","upgrade":"","meaning":"","example":""}],
  "bands":{
    "taskAchievement":6.0,
    "coherence":6.0,
    "lexicalResource":6.0,
    "grammaticalRange":6.0,
    "overall":6.0
  },
  "scores":{"grammar":75,"vocabulary":75,"coherence":75,"overall":75},
  "modelAnswerSnippet":"2-3 sentence model improvement",
  "motivation":""
}
Bands 0-9 in 0.5 steps. scores are 0-100 percentages for UI.

TEXT:
${text}`;

    const result = await safeGenerate(() => model.generateContent(prompt));
    const parsed = cleanJSON(result.response.text());

    if (!parsed) {
      throw new Error('Invalid writing analysis response');
    }

    const bands = parsed.bands || {};
    const overallBand = bands.overall || 6;
    const pct = (b) => Math.round((b / 9) * 100);

    return {
      correctedText: parsed.correctedText || text,
      errors: parsed.errors || [],
      structuralAnalysis: parsed.structuralAnalysis || '',
      betterNativeVersion: parsed.betterNativeVersion || '',
      vocabularyUpgrades: parsed.vocabularyUpgrades || [],
      bands,
      scores: parsed.scores || {
        grammar: pct(bands.grammaticalRange || overallBand),
        vocabulary: pct(bands.lexicalResource || overallBand),
        coherence: pct(bands.coherence || overallBand),
        overall: pct(overallBand),
      },
      modelAnswerSnippet: parsed.modelAnswerSnippet || '',
      motivation: parsed.motivation || 'Keep practising — review the band descriptors.',
      taskType,
    };
  } catch (error) {
    console.error('analyzeWriting error:', error.message);
    return {
      correctedText: text,
      errors: [],
      structuralAnalysis: 'Analysis unavailable. Check GEMINI_API_KEY.',
      betterNativeVersion: text,
      vocabularyUpgrades: [],
      bands: { taskAchievement: 5, coherence: 5, lexicalResource: 5, grammaticalRange: 5, overall: 5 },
      scores: { grammar: 55, vocabulary: 55, coherence: 55, overall: 55 },
      modelAnswerSnippet: '',
      motivation: 'Please try again when the AI service is available.',
      taskType,
    };
  }
}

export async function analyzePronunciation(text) {
  return {
    ipa: '',
    syllables: '',
    stressPattern: '',
    mouthPositioning: '',
    commonMistakes: '',
    audioTips: '',
    practiceExercises: [text],
  };
}

const VOCAB_ENTRY_JSON = `
Return ONLY JSON for an English–Bangla vocabulary entry:
{
  "english":"exact word or phrase as given",
  "bangla":"Bengali meaning (natural, learner-friendly)",
  "pronunciation":"IPA without slashes, e.g. ˈæk.jə.rət",
  "partOfSpeech":"one of: noun, verb, adjective, adverb, preposition, conjunction, interjection, pronoun, phrase, idiom",
  "example":"one natural English example sentence using the word",
  "exampleBangla":"Bengali translation of the example",
  "category":"short topic label e.g. General, Business, IELTS, Travel, Education",
  "difficulty":"one of: beginner, intermediate, advanced",
  "synonyms":["up to 3 English synonyms"]
}`;

export async function generateVocabularyEntry(english) {
  const word = String(english || '').trim();
  if (!word) throw new Error('Word is required');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a bilingual English–Bangla lexicographer for Bangladeshi learners.
Create a dictionary entry for: "${word}"
${VOCAB_ENTRY_JSON}`;

    const result = await safeGenerate(() => model.generateContent(prompt));
    const parsed = cleanJSON(result.response.text());

    if (!parsed?.bangla) {
      throw new Error('AI could not generate a valid entry');
    }

    const allowedPos = [
      'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction',
      'interjection', 'pronoun', 'phrase', 'idiom',
    ];
    const pos = String(parsed.partOfSpeech || 'noun').toLowerCase();
    const difficulty = ['beginner', 'intermediate', 'advanced'].includes(parsed.difficulty)
      ? parsed.difficulty
      : 'intermediate';

    return {
      english: String(parsed.english || word).trim(),
      bangla: String(parsed.bangla).trim(),
      pronunciation: String(parsed.pronunciation || '').replace(/^\/|\/$/g, '').trim(),
      partOfSpeech: allowedPos.includes(pos) ? pos : 'noun',
      example: String(parsed.example || '').trim(),
      exampleBangla: String(parsed.exampleBangla || '').trim(),
      category: String(parsed.category || 'My Words').trim() || 'My Words',
      difficulty,
      synonyms: Array.isArray(parsed.synonyms)
        ? parsed.synonyms.map((s) => String(s).trim()).filter(Boolean).slice(0, 5)
        : [],
    };
  } catch (error) {
    console.error('generateVocabularyEntry error:', error.message);
    throw error;
  }
}

export async function transcribeAudio(base64Data, mimeType = 'audio/webm') {
  assertGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await safeGenerate(() =>
    model.generateContent([
      { inlineData: { mimeType, data: base64Data } },
      {
        text: 'Transcribe the spoken English in this audio. Return only the transcript text with no labels or explanation.',
      },
    ])
  );
  return result.response.text().trim();
}
