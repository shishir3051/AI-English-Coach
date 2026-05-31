import express from 'express';
import DailyChallenge from '../models/DailyChallenge.js';

const router = express.Router();

// Seed data — 9 diverse challenges (3 of each type)
const INITIAL_CHALLENGES = [
  {
    id: "challenge_error_1",
    type: "error",
    title: "Spot & Correct the Error",
    instruction: "Identify the mistake in the sentence and type the fully corrected sentence.",
    sentence: "She don't likes apples because they is sour.",
    correctAnswer: "She doesn't like apples because they are sour.",
    optionsHint: "Watch out for subject-verb agreement and present tense singular negatives.",
    points: 15
  },
  {
    id: "challenge_error_2",
    type: "error",
    title: "Grammar Repair",
    instruction: "Find and fix the grammatical error in the sentence below.",
    sentence: "He goed to the market yesterday and buyed some vegetables.",
    correctAnswer: "He went to the market yesterday and bought some vegetables.",
    optionsHint: "Both 'goed' and 'buyed' are incorrect — these are irregular past tense verbs.",
    points: 15
  },
  {
    id: "challenge_error_3",
    type: "error",
    title: "Tense Detective",
    instruction: "Correct the tense error in this sentence.",
    sentence: "By the time she arrived, he already leave the office.",
    correctAnswer: "By the time she arrived, he had already left the office.",
    optionsHint: "When one past action happens before another, use Past Perfect (had + V3).",
    points: 20
  },
  {
    id: "challenge_vocab_1",
    type: "vocab",
    title: "Synonym Matcher",
    instruction: "Select the word closest in meaning to: 'ELOQUENT'",
    options: ["Quiet", "Persuasive and fluent", "Hesitant", "Loud"],
    answerIndex: 1,
    explanation: "Eloquent (/ˈel.ə.kwənt/) means fluent or persuasive in speaking or writing.",
    points: 10
  },
  {
    id: "challenge_vocab_2",
    type: "vocab",
    title: "Word Power Quiz",
    instruction: "Choose the correct meaning of: 'METICULOUS'",
    options: ["Careless and rough", "Very careful and precise", "Bold and daring", "Lazy and slow"],
    answerIndex: 1,
    explanation: "Meticulous (/məˈtɪk.jə.ləs/) means showing great attention to detail; very careful and precise.",
    points: 10
  },
  {
    id: "challenge_vocab_3",
    type: "vocab",
    title: "Context Clue Challenge",
    instruction: "Which word best replaces 'HAPPY' in a formal essay?",
    options: ["Glad", "Ecstatic", "Jovial", "Elated"],
    answerIndex: 3,
    explanation: "Elated is the most formal and precise replacement for 'happy' in academic or formal writing contexts.",
    points: 10
  },
  {
    id: "challenge_reorder_1",
    type: "reorder",
    title: "Sentence Reconstructor",
    instruction: "Reorder the words to construct a grammatically correct sentence.",
    blocks: ["English", "she", "fluently", "speaks", "every day"],
    correctSequence: "she speaks English fluently every day",
    points: 15
  },
  {
    id: "challenge_reorder_2",
    type: "reorder",
    title: "Clause Builder",
    instruction: "Arrange the blocks into a correct conditional sentence.",
    blocks: ["had studied", "she", "she would have passed", "harder", "if"],
    correctSequence: "if she had studied harder she would have passed",
    points: 20
  },
  {
    id: "challenge_reorder_3",
    type: "reorder",
    title: "Question Constructor",
    instruction: "Rearrange the words to form a correct question.",
    blocks: ["have", "you", "been", "how long", "learning English"],
    correctSequence: "how long have you been learning English",
    points: 15
  }
];

// GET /api/challenges — list all challenges (seed if empty)
router.get('/', async (req, res) => {
  try {
    let challenges = await DailyChallenge.find().sort({ type: 1 });

    if (challenges.length === 0) {
      await DailyChallenge.insertMany(INITIAL_CHALLENGES);
      challenges = await DailyChallenge.find().sort({ type: 1 });
    }

    res.json(challenges);
  } catch (error) {
    console.error('Challenges fetch error:', error);
    // Graceful fallback: return hardcoded data if DB is offline
    res.json(INITIAL_CHALLENGES);
  }
});

// GET /api/challenges/daily — returns one random set (1 of each type)
router.get('/daily', async (req, res) => {
  try {
    let challenges = await DailyChallenge.find();
    if (challenges.length === 0) {
      await DailyChallenge.insertMany(INITIAL_CHALLENGES);
      challenges = await DailyChallenge.find();
    }

    const pick = (type) => {
      const pool = challenges.filter(c => c.type === type);
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const daily = [pick('error'), pick('vocab'), pick('reorder')].filter(Boolean);
    res.json(daily);
  } catch (error) {
    console.error('Daily challenges error:', error);
    res.json(INITIAL_CHALLENGES.slice(0, 3));
  }
});

// POST /api/challenges — add a new challenge (admin)
router.post('/', async (req, res) => {
  try {
    const challenge = new DailyChallenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create challenge', details: error.message });
  }
});

// DELETE /api/challenges/:id — remove a challenge
router.delete('/:id', async (req, res) => {
  try {
    await DailyChallenge.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete challenge', details: error.message });
  }
});

export default router;
