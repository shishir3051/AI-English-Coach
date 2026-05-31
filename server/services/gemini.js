import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Modes descriptions for System Prompt context
const MODES = {
  Beginner: "Speak in simple English, use basic vocabulary, keep sentences short and slow. Explain grammar rules clearly if mistakes are made. Be extremely encouraging, like a kind primary school teacher.",
  Intermediate: "Speak in clear, natural English. Introduce occasional idioms and everyday expressions. Ask engaging, open-ended questions about hobbies, habits, and ideas.",
  Advanced: "Use sophisticated language, complex idioms, and advanced vocabulary. Discuss deep topics like culture, technology, philosophy, and global events. Challenge the user's arguments.",
  IELTS: "Act as an official IELTS Speaking & Writing Examiner. Conduct formal assessments. Provide feedback based on IELTS criteria: Fluency/Coherence, Lexical Resource, Grammatical Range/Accuracy, and Pronunciation. Assign a band score (0-9).",
  Kids: "Speak in a super friendly, enthusiastic, and playful manner. Use visual metaphors and fun themes. Play simple word games and keep tasks light and rewarding.",
  Professional: "Focus on Business English, professional email writing, workplace communication, meetings, and negotiation tactics. Use corporate terminology and formal phrasing.",
  'Fast Speaking': "Focus on conversational flow, contraction usage (wanna, gonna), slang, connected speech, and auditory rhythm. Encourage rapid-fire exchanges."
};

/**
 * Main chat interaction with Gemini
 */
export async function getCoachResponse({ message, history, mode = 'Intermediate', userLevel = 'Intermediate' }) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const modePrompt = MODES[mode] || MODES.Intermediate;

    const systemInstruction = `
You are an advanced AI English Learning Coach and Communication Trainer.
Your goal is to help the user improve their English from Basic to Advanced.
Mode: ${mode} (Context: ${modePrompt})
User Level: ${userLevel}

Your behaviors:
1. Always act like a supportive personal mentor. Never shame the user.
2. Automatically detect spelling and grammar mistakes in the user's input.
3. Suggest native-level alternatives.
4. Give simple explanations of mistakes.
5. Provide pronunciation tips (e.g. IPA or phonetic spelling) if needed.
6. Provide advanced vocabulary upgrades (with meanings and examples).
7. Keep conversations interactive, natural, and friendly. Ask follow-up questions.
8. Adapt the difficulty level based on the user's skills.

You must respond in JSON format with the following keys:
{
  "reply": "Your conversational reply to the user. Maintain the persona. Do not put markdown formatting inside the JSON reply, just plain text.",
  "correction": {
    "original": "The exact original sentence/phrase from the user that had an error. If there are multiple errors, analyze the main ones.",
    "corrected": "The corrected version of the user's sentence.",
    "explanation": "A simple, clear explanation of the mistakes.",
    "betterNative": "A natural, fluent, native-level alternative to express the same idea.",
    "pronunciationTips": "Phonetic guidance for difficult words in the user's sentence.",
    "vocabularyUpgrade": "Advanced alternatives with meaning, pronunciation guide, and an example sentence.",
    "confidenceScore": 85, // Number between 0 and 100 based on grammar and phrasing
    "motivation": "Short encouraging message (1 sentence)."
  }
}

NOTE: If the user's input is grammatically correct and has no spelling or structural errors, set the "correction" key to null.
If they say things like "Practice Speaking", "Mock Interview", "IELTS", etc., just start the simulation without correcting the command itself.
`;

    // Process history into Gemini API format
    const contents = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const result = await model.generateContent({
      contents,
      systemInstruction: systemInstruction
    });

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Specific deep writing analysis
 */
export async function analyzeWriting(textToAnalyze) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `
Analyze this English writing submission for grammar, spelling, structure, coherence, style, and tone.
Text: "${textToAnalyze}"

Respond in JSON format with the following keys:
{
  "correctedText": "The entire text with spelling and grammar corrections applied.",
  "errors": [
    {
      "original": "substring containing error",
      "corrected": "corrected substring",
      "type": "grammar" | "spelling" | "style" | "punctuation",
      "explanation": "Why this is an error and how to fix it."
    }
  ],
  "structuralAnalysis": "Detailed analysis of sentence structure, flow, and coherence.",
  "betterNativeVersion": "A beautifully written, native-level rewrite of the entire text.",
  "vocabularyUpgrades": [
    {
      "originalWord": "word to replace",
      "upgrade": "advanced alternative",
      "meaning": "Meaning of the upgrade word",
      "example": "Example sentence using the upgrade word"
    }
  ],
  "scores": {
    "grammar": 80, // 0-100
    "vocabulary": 75, // 0-100
    "coherence": 85, // 0-100
    "overall": 80 // 0-100
  },
  "motivation": "A warm, supportive, and encouraging feedback message."
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Error analyzing writing with Gemini API:', error);
    throw error;
  }
}

/**
 * Specific pronunciation analyzer
 */
export async function analyzePronunciation(wordOrText) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `
Analyze the pronunciation of the following English phrase or word: "${wordOrText}"
Provide guidance on phonetic breaks, stress patterns, mouth positioning, and common non-native mistakes.

Respond in JSON format with the following keys:
{
  "ipa": "International Phonetic Alphabet transcription (e.g. /prəˌnʌnsiˈeɪʃən/)",
  "syllables": "Syllable breakdown (e.g. pro-nun-ci-a-tion)",
  "stressPattern": "Details on which syllables to stress",
  "mouthPositioning": "Step-by-step physical guide (e.g., placement of tongue, lips shape) for the trickiest sounds",
  "commonMistakes": "Typical mispronunciations and how to avoid them",
  "audioTips": "Guidance on pitch, linking words, or intonation",
  "practiceExercises": [
    "Short phrases or sentences to practice this specific pronunciation"
  ]
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Error analyzing pronunciation with Gemini API:', error);
    throw error;
  }
}
