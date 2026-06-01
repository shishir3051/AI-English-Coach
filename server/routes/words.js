import express from 'express';
import WordOfDay from '../models/WordOfDay.js';

const router = express.Router();

const INITIAL_WORDS = [
  { word: "Resilient", phonetic: "/rɪˈzɪl.jənt/", meaning: "Able to withstand or recover quickly from difficult conditions.", example: "She is a resilient girl who never gives up.", bangla: "সহনশীল — যে বা যা কঠিন পরিস্থিতিতেও ভেঙে না পড়ে।", category: "adjective" },
  { word: "Exquisite", phonetic: "/ɪkˈskwɪz.ɪt/", meaning: "Extremely beautiful and delicate.", example: "The designer showcased an exquisite collection of dresses.", bangla: "অতীব সুন্দর — অত্যন্ত সূক্ষ্ম ও আকর্ষণীয়।", category: "adjective" },
  { word: "Pragmatic", phonetic: "/præɡˈmæt.ɪk/", meaning: "Dealing with things sensibly and realistically based on practical considerations.", example: "We need a pragmatic approach to solve this issue.", bangla: "বাস্তববাদী — যিনি কার্যত ও বাস্তবসম্মতভাবে চিন্তা করেন।", category: "adjective" },
  { word: "Meticulous", phonetic: "/məˈtɪk.jə.ləs/", meaning: "Showing great attention to detail; very careful and precise.", example: "The accountant was meticulous in checking the records.", bangla: "সূক্ষ্মদর্শী — যিনি প্রতিটি বিষয়ে অত্যন্ত মনোযোগী ও নিখুঁত।", category: "adjective" },
  { word: "Eloquent", phonetic: "/ˈel.ə.kwənt/", meaning: "Fluent or persuasive in speaking or writing.", example: "Her eloquent speech moved the entire audience to tears.", bangla: "বাগ্মী — যিনি সুন্দর ও প্রভাবশালীভাবে বলতে বা লিখতে পারেন।", category: "adjective" },
  { word: "Ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", meaning: "Open to more than one interpretation; not clear in meaning.", example: "The politician gave an ambiguous answer to avoid controversy.", bangla: "দ্ব্যর্থবোধক — যার অর্থ স্পষ্ট নয়, একাধিক অর্থ হতে পারে।", category: "adjective" },
  { word: "Tenacious", phonetic: "/təˈneɪ.ʃəs/", meaning: "Holding firmly to something; very determined.", example: "Her tenacious spirit helped her finish the marathon.", bangla: "অদম্য — যিনি লক্ষ্য অর্জনে দৃঢ়প্রতিজ্ঞ।", category: "adjective" },
  { word: "Ephemeral", phonetic: "/ɪˈfem.ər.əl/", meaning: "Lasting for a very short time; transient.", example: "Fame can be ephemeral if not backed by consistent hard work.", bangla: "ক্ষণস্থায়ী — যা অল্প সময়ের জন্য থাকে।", category: "adjective" },
  { word: "Articulate", phonetic: "/ɑːˈtɪk.jə.lɪt/", meaning: "Having or showing the ability to speak fluently and coherently.", example: "She was articulate in presenting her ideas to the board.", bangla: "স্পষ্টভাষী — যিনি সুস্পষ্ট ও প্রবাহমানভাবে কথা বলতে পারেন।", category: "adjective" },
  { word: "Diligent", phonetic: "/ˈdɪl.ɪ.dʒənt/", meaning: "Having or showing care and conscientiousness in one's work or duties.", example: "A diligent student always reviews notes after class.", bangla: "পরিশ্রমী — যিনি নিষ্ঠার সাথে কাজ করেন।", category: "adjective" },
  { word: "Persevere", phonetic: "/ˌpɜː.sɪˈvɪər/", meaning: "Continue in a course of action even in the face of difficulty.", example: "She persevered through all hardships to achieve her dream.", bangla: "অধ্যবসায় করা — বাধা সত্ত্বেও চেষ্টা চালিয়ে যাওয়া।", category: "verb" },
  { word: "Coherent", phonetic: "/koʊˈhɪr.ənt/", meaning: "Logical and consistent; easy to understand.", example: "Please give a coherent explanation of your plan.", bangla: "সুসংগত — যা যুক্তিসঙ্গত ও সহজে বোঝা যায়।", category: "adjective" },
  { word: "Profound", phonetic: "/prəˈfaʊnd/", meaning: "Very great or intense; having deep meaning.", example: "Her words had a profound impact on everyone present.", bangla: "গভীর — যা অত্যন্ত তীব্র বা গভীর অর্থবহ।", category: "adjective" },
  { word: "Versatile", phonetic: "/ˈvɜː.sə.taɪl/", meaning: "Able to adapt or be adapted to many different functions or activities.", example: "A versatile employee can handle multiple tasks efficiently.", bangla: "বহুমুখী — যিনি বিভিন্ন কাজে দক্ষ ও মানিয়ে নিতে পারেন।", category: "adjective" },
  { word: "Concise", phonetic: "/kənˈsaɪs/", meaning: "Giving a lot of information clearly and in a few words.", example: "Write a concise summary of the report in two paragraphs.", bangla: "সংক্ষিপ্ত — যা অল্প কথায় অনেক কিছু বলে।", category: "adjective" }
];

// ✅ IMPORTANT: Specific routes BEFORE dynamic routes ✅

// GET /api/words/daily — return a word based on day of year (consistent per day)
router.get('/daily', async (req, res) => {
  try {
    let words = await WordOfDay.find();
    if (words.length === 0) {
      await WordOfDay.insertMany(INITIAL_WORDS);
      words = await WordOfDay.find();
    }
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const word = words[dayOfYear % words.length];
    res.json(word);
  } catch (error) {
    console.error('Daily word error:', error);
    res.json(INITIAL_WORDS[0]);
  }
});

// GET /api/words/random — return a random word
router.get('/random', async (req, res) => {
  try {
    let words = await WordOfDay.find();
    if (words.length === 0) {
      await WordOfDay.insertMany(INITIAL_WORDS);
      words = await WordOfDay.find();
    }
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log('Random word fetched:', randomWord.word);
    res.json(randomWord);
  } catch (error) {
    console.error('Random word error:', error);
    const randomWord = INITIAL_WORDS[Math.floor(Math.random() * INITIAL_WORDS.length)];
    res.json(randomWord);
  }
});

// GET /api/words — all words (seed if empty)
router.get('/', async (req, res) => {
  try {
    let words = await WordOfDay.find().sort({ createdAt: 1 });
    if (words.length === 0) {
      await WordOfDay.insertMany(INITIAL_WORDS);
      words = await WordOfDay.find().sort({ createdAt: 1 });
    }
    res.json(words);
  } catch (error) {
    console.error('Words fetch error:', error);
    res.json(INITIAL_WORDS);
  }
});

// POST /api/words — add a word
router.post('/', async (req, res) => {
  try {
    const word = new WordOfDay(req.body);
    await word.save();
    res.status(201).json(word);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add word', details: error.message });
  }
});

// DELETE /api/words/:word (dynamic route - must be AFTER specific routes)
router.delete('/:word', async (req, res) => {
  try {
    await WordOfDay.findOneAndDelete({ word: req.params.word });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete word', details: error.message });
  }
});

export default router;
