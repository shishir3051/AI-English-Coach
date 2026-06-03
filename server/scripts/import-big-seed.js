/**
 * Import vocabularyBigSeed.js into MongoDB.
 * Run from server/: node scripts/import-big-seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { VOCABULARY_BIG_SEED } from '../data/vocabularyBigSeed.js';
import Vocabulary from '../models/Vocabulary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌ MONGODB_URI missing'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const before = await Vocabulary.countDocuments();
  console.log(`📊 Words in DB before import: ${before}`);

  let inserted = 0, skipped = 0, updated = 0;
  const byCategory = {};

  for (const row of VOCABULARY_BIG_SEED) {
    if (!row.english?.trim() || !row.bangla?.trim()) continue;

    const english = row.english.trim();
    const existing = await Vocabulary.findOne({
      english: new RegExp(`^${escapeRegex(english)}$`, 'i'),
    }).lean();

    if (existing) {
      // If existing entry is missing example or synonyms, patch it
      const needsUpdate =
        (!existing.example && row.example) ||
        (!existing.exampleBangla && row.exampleBangla) ||
        (!existing.synonyms?.length && row.synonyms?.length) ||
        (!existing.antonyms?.length && row.antonyms?.length);

      if (needsUpdate) {
        await Vocabulary.findByIdAndUpdate(existing._id, {
          $set: {
            ...((!existing.example && row.example) ? { example: row.example } : {}),
            ...((!existing.exampleBangla && row.exampleBangla) ? { exampleBangla: row.exampleBangla } : {}),
            ...((!existing.synonyms?.length && row.synonyms?.length) ? { synonyms: row.synonyms } : {}),
            ...((!existing.antonyms?.length && row.antonyms?.length) ? { antonyms: row.antonyms } : {}),
          }
        });
        updated++;
      } else {
        skipped++;
      }
      continue;
    }

    const allowedPos = ['noun','verb','adjective','adverb','preposition','conjunction','interjection','pronoun','phrase','idiom'];
    const pos = String(row.partOfSpeech || 'noun').toLowerCase();
    const difficulty = ['beginner','intermediate','advanced'].includes(row.difficulty) ? row.difficulty : 'beginner';

    await Vocabulary.create({
      english,
      bangla: row.bangla.trim(),
      pronunciation: row.pronunciation || '',
      partOfSpeech: allowedPos.includes(pos) ? pos : 'noun',
      example: row.example || '',
      exampleBangla: row.exampleBangla || '',
      category: row.category || 'General',
      difficulty,
      synonyms: Array.isArray(row.synonyms) ? row.synonyms : [],
      antonyms: Array.isArray(row.antonyms) ? row.antonyms : [],
    });

    inserted++;
    byCategory[row.category] = (byCategory[row.category] || 0) + 1;
  }

  const after = await Vocabulary.countDocuments();
  console.log('\n✅ Import complete:');
  console.log(`   Inserted : ${inserted}`);
  console.log(`   Updated  : ${updated} (filled missing examples/synonyms/antonyms)`);
  console.log(`   Skipped  : ${skipped} (already complete)`);
  console.log(`   DB Total : ${before} → ${after}`);
  console.log('\n   New words by category:');
  Object.keys(byCategory).sort().forEach(c => console.log(`     ${c}: ${byCategory[c]}`));

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
