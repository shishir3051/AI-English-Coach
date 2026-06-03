import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
const apiKey = process.env.GEMINI_API_KEY;

if (!uri || !apiKey) {
  console.error('❌ MONGODB_URI or GEMINI_API_KEY missing in server/.env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const vocabularySchema = new mongoose.Schema({
  english: { type: String, required: true, index: true },
  bangla: { type: String, required: true },
  pronunciation: { type: String, default: '' },
  partOfSpeech: { type: String, default: 'noun', enum: ['noun','verb','adjective','adverb','preposition','conjunction','interjection','pronoun','phrase','idiom'] },
  example: { type: String, default: '' },
  exampleBangla: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  difficulty: { type: String, default: 'beginner', enum: ['beginner','intermediate','advanced'] },
  synonyms: [{ type: String }],
}, { timestamps: true });

vocabularySchema.index({ english: 'text', bangla: 'text' });

let Vocabulary;
try {
  Vocabulary = mongoose.model('Vocabulary');
} catch {
  Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
}

// Allowed values
const ALLOWED_POS = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun', 'phrase', 'idiom'];
const ALLOWED_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// Targets for balancing
const TARGET_TOTAL = 5000;

const CATEGORIES = [
  'Academic',
  'Action Phrases',
  'Action Verbs',
  'Adverbs',
  'Animals',
  'Business',
  'Common Phrases',
  'Communication',
  'Countries & Geography',
  'Days & Time',
  'Descriptive Words',
  'Education',
  'Everyday Objects',
  'General',
  'Grammar',
  'IELTS',
  'Legal',
  'Literature',
  'Medical',
  'Months & Time',
  'Nature',
  'Opposite Adjectives',
  'Ordinal Numbers',
  'Professional',
  'Science',
  'Sports',
  'Technology',
  'Years & Dates'
]; // Exclude 'Numbers' since it already has 2,500 entries

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

async function main() {
  await mongoose.connect(uri);
  console.log('🔌 Connected to MongoDB');

  let totalCount = await Vocabulary.countDocuments();
  console.log(`📊 Initial DB count: ${totalCount} words`);

  if (totalCount >= TARGET_TOTAL) {
    console.log(`✅ Target of ${TARGET_TOTAL} words already met or exceeded.`);
    process.exit(0);
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  while (totalCount < TARGET_TOTAL) {
    // 1. Recalculate stats to see what category and difficulty needs words most
    const counts = await Vocabulary.aggregate([
      {
        $group: {
          _id: { category: '$category', difficulty: '$difficulty' },
          count: { $sum: 1 }
        }
      }
    ]);

    const report = {};
    CATEGORIES.forEach(cat => {
      report[cat] = { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
    });

    counts.forEach(c => {
      const cat = c._id.category;
      const diff = c._id.difficulty || 'beginner';
      if (report[cat]) {
        report[cat][diff] = c.count;
        report[cat].total += c.count;
      }
    });

    // 2. Select category with the lowest total count
    let targetCategory = '';
    let minCount = Infinity;
    CATEGORIES.forEach(cat => {
      if (report[cat].total < minCount) {
        minCount = report[cat].total;
        targetCategory = cat;
      }
    });

    if (!targetCategory) {
      console.log('No valid category found to target.');
      break;
    }

    // 3. Select difficulty in that category that is least populated
    let targetDifficulty = 'beginner';
    let minDiffCount = Infinity;
    ALLOWED_DIFFICULTIES.forEach(diff => {
      if (report[targetCategory][diff] < minDiffCount) {
        minDiffCount = report[targetCategory][diff];
        targetDifficulty = diff;
      }
    });

    console.log(`\n🎯 Targeting Category: "${targetCategory}" | Difficulty: "${targetDifficulty}" (Current count: ${minCount} total, ${minDiffCount} in ${targetDifficulty})`);

    // 4. Fetch existing words in this category to avoid duplicates
    const existingWords = await Vocabulary.find({ category: targetCategory }).select('english').lean();
    const existingList = existingWords.map(w => w.english.toLowerCase());

    const limitToGenerate = Math.min(15, TARGET_TOTAL - totalCount);
    console.log(`📝 Requesting ${limitToGenerate} words from Gemini...`);

    const prompt = `You are a professional bilingual lexicographer creating a high-quality vocabulary database for Bangladeshi English learners.
Generate a JSON array of exactly ${limitToGenerate} unique, high-quality English vocabulary words or phrases.

Target criteria:
- Category: "${targetCategory}"
- Difficulty: "${targetDifficulty}"

Each word/phrase must follow this exact JSON schema:
{
  "english": "word or phrase",
  "bangla": "Bengali meaning (natural, contextually accurate)",
  "pronunciation": "IPA pronunciation, e.g. ˈæk.jə.rət",
  "partOfSpeech": "one of: noun, verb, adjective, adverb, preposition, conjunction, interjection, pronoun, phrase, idiom",
  "example": "example sentence using this word",
  "exampleBangla": "Bengali translation of the example sentence",
  "category": "${targetCategory}",
  "difficulty": "${targetDifficulty}",
  "synonyms": ["up to 3 English synonyms"]
}

Avoid these words/phrases (already in the database for this category):
${existingList.slice(0, 300).join(', ')}

Ensure that the part of speech is correct. Return ONLY the raw JSON array. No explanations, no markdown formatting blocks.`;

    try {
      const response = await model.generateContent(prompt);
      const responseText = response.response.text();
      const parsed = cleanJSON(responseText);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.warn('⚠️ Gemini returned invalid JSON or empty array, retrying in 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      console.log(`✨ Gemini returned ${parsed.length} entries. Processing and saving to DB...`);

      let insertedCount = 0;
      for (const entry of parsed) {
        if (!entry.english || !entry.bangla) continue;

        const englishClean = entry.english.trim();
        const lowerEnglish = englishClean.toLowerCase();

        // Check duplicates again before insert
        const isDuplicate = existingList.includes(lowerEnglish) || 
                            (await Vocabulary.findOne({ english: new RegExp(`^${englishClean}$`, 'i'), category: targetCategory }).lean());

        if (isDuplicate) {
          continue;
        }

        const pos = String(entry.partOfSpeech || 'noun').toLowerCase();
        const difficulty = ALLOWED_DIFFICULTIES.includes(entry.difficulty) ? entry.difficulty : targetDifficulty;

        await Vocabulary.create({
          english: englishClean,
          bangla: String(entry.bangla).trim(),
          pronunciation: String(entry.pronunciation || '').replace(/^\/|\/$/g, '').trim(),
          partOfSpeech: ALLOWED_POS.includes(pos) ? pos : 'noun',
          example: String(entry.example || '').trim(),
          exampleBangla: String(entry.exampleBangla || '').trim(),
          category: targetCategory,
          difficulty: difficulty,
          synonyms: Array.isArray(entry.synonyms) ? entry.synonyms.map(s => String(s).trim()).filter(Boolean) : [],
        });

        insertedCount++;
        totalCount++;
      }

      console.log(`✅ Successfully inserted ${insertedCount} words. Current DB Total: ${totalCount}/${TARGET_TOTAL} words.`);

      // Add a small delay to avoid hitting Gemini API rate limits
      await new Promise(r => setTimeout(r, 2500));

    } catch (err) {
      console.error('❌ Error during generation or DB write:', err.message);
      console.log('Waiting 5 seconds before retrying...');
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log(`\n🎉 Completed! Database now has ${totalCount} words.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
