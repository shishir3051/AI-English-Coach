import express from 'express';
import mongoose from 'mongoose';
import {
  buildPartOfSpeechFilter,
  rollupPartsOfSpeech,
  normalizePartOfSpeech,
} from '../utils/partOfSpeech.js';
import { generateVocabularyEntry } from '../services/gemini.js';

const router = express.Router();

import Vocabulary from '../models/Vocabulary.js';

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// POST /api/vocabulary/add — AI fills fields and saves to MongoDB
router.post('/add', async (req, res) => {
  try {
    const english = String(req.body.english || '').trim();
    if (!english) {
      return res.status(400).json({ error: 'Enter an English word or phrase' });
    }

    const existing = await Vocabulary.findOne({
      english: new RegExp(`^${escapeRegex(english)}$`, 'i'),
    });

    if (existing && !req.body.regenerate) {
      return res.json({
        word: existing,
        created: false,
        message: 'This word is already in the dictionary',
      });
    }

    const generated = await generateVocabularyEntry(english);
    const partOfSpeech =
      normalizePartOfSpeech(generated.partOfSpeech) || generated.partOfSpeech || 'noun';

    const payload = {
      ...generated,
      partOfSpeech,
      category: generated.category || 'My Words',
    };

    let word;
    if (existing) {
      word = await Vocabulary.findByIdAndUpdate(existing._id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json({
        word,
        created: false,
        updated: true,
        message: 'Word updated with AI details',
      });
    }

    word = await Vocabulary.create(payload);
    return res.status(201).json({
      word,
      created: true,
      message: 'Word added to the dictionary',
    });
  } catch (err) {
    console.error('Vocabulary add error:', err);
    res.status(500).json({
      error: err.message || 'Failed to add word',
    });
  }
});

// GET /api/vocabulary/stats  ← must be before '/' 
router.get('/stats', async (req, res) => {
  try {
    const total = await Vocabulary.countDocuments();
    const difficulties  = await Vocabulary.aggregate([{ $group: { _id: '$difficulty',   count: { $sum: 1 } } }]);
    const partsRaw = await Vocabulary.aggregate([{ $group: { _id: '$partOfSpeech', count: { $sum: 1 } } }]);
    const rolled = rollupPartsOfSpeech(partsRaw);
    res.json({
      total,
      difficulties,
      partsOfSpeech: partsRaw,
      partsOfSpeechOptions: rolled.options,
      partsOfSpeechTypes: rolled.totalTypes,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/vocabulary/parts-of-speech  ← must be before '/'
router.get('/parts-of-speech', async (req, res) => {
  try {
    const partsRaw = await Vocabulary.aggregate([{ $group: { _id: '$partOfSpeech', count: { $sum: 1 } } }]);
    const rolled = rollupPartsOfSpeech(partsRaw);
    res.json(rolled.options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocabulary/categories  ← must be before '/'
router.get('/categories', async (req, res) => {
  try {
    const categories = await Vocabulary.distinct('category');
    res.json(categories.sort());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/vocabulary
router.get('/', async (req, res) => {
  try {
    // FIX 1: parseInt — req.query values are always strings
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const { search, category, difficulty, partOfSpeech } = req.query;

    // FIX 2: build filter only with defined values
    const filter = {};
    if (search?.trim())  filter.$text        = { $search: search.trim() };
    if (category)        filter.category     = category;
    if (difficulty)      filter.difficulty   = difficulty;
    if (partOfSpeech) {
      Object.assign(filter, buildPartOfSpeechFilter(partOfSpeech));
    }

    // FIX 3: parallel count + find
    const [totalWords, words] = await Promise.all([
      Vocabulary.countDocuments(filter),
      Vocabulary.find(filter)
        .sort(search?.trim() ? { score: { $meta: 'textScore' } } : { english: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      words,
      page,
      limit,
      totalWords,
      totalPages: Math.ceil(totalWords / limit),
    });
  } catch (err) {
    console.error('Vocabulary fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;