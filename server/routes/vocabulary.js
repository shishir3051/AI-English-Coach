import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

let Vocabulary;
try {
  Vocabulary = mongoose.model('Vocabulary');
} catch {
  const vocabularySchema = new mongoose.Schema({
    english:       { type: String, required: true, index: true },
    bangla:        { type: String, required: true },
    pronunciation: { type: String, default: '' },
    partOfSpeech:  { type: String, default: 'noun',
                     enum: ['noun','verb','adjective','adverb','preposition',
                            'conjunction','interjection','pronoun','phrase','idiom'] },
    example:       { type: String, default: '' },
    exampleBangla: { type: String, default: '' },
    category:      { type: String, required: true, index: true },
    difficulty:    { type: String, default: 'beginner',
                     enum: ['beginner','intermediate','advanced'] },
    synonyms:      [{ type: String }],
  }, { timestamps: true });
  vocabularySchema.index({ english: 'text', bangla: 'text' });
  Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
}

// GET /api/vocabulary/stats  ← must be before '/' 
router.get('/stats', async (req, res) => {
  try {
    const total = await Vocabulary.countDocuments();
    const difficulties  = await Vocabulary.aggregate([{ $group: { _id: '$difficulty',   count: { $sum: 1 } } }]);
    const partsOfSpeech = await Vocabulary.aggregate([{ $group: { _id: '$partOfSpeech', count: { $sum: 1 } } }]);
    res.json({ total, difficulties, partsOfSpeech });
  } catch (err) { res.status(500).json({ error: err.message }); }
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
    if (partOfSpeech)    filter.partOfSpeech = partOfSpeech;

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