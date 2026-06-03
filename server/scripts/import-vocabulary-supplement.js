/**
 * Import supplement vocabulary (empty parts of speech + extra verbs/adverbs).
 *
 * Usage (from server/):
 *   npm run import:vocab
 *
 * Optional: add JSON arrays under server/data/vocabulary/*.json
 */
import {
  connectMongoFromEnv,
  collectVocabularySupplement,
  importVocabularySupplementToDb,
  supplementSeedStats,
} from '../lib/vocabularyImport.js';

async function main() {
  const seedCounts = supplementSeedStats();
  const preview = collectVocabularySupplement();

  console.log('📦 Vocabulary supplement to import:');
  console.log(`   Total entries: ${preview.length}`);
  for (const [pos, n] of Object.entries(seedCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${pos}: ${n}`);
  }

  await connectMongoFromEnv();
  const stats = await importVocabularySupplementToDb();

  console.log('✅ Import complete:');
  console.log(`   Inserted: ${stats.inserted}`);
  console.log(`   Skipped (already in DB): ${stats.skipped}`);
  if (Object.keys(stats.byPart).length) {
    console.log('   New by part of speech:');
    for (const [pos, n] of Object.entries(stats.byPart).sort((a, b) => b[1] - a[1])) {
      console.log(`     ${pos}: ${n}`);
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message);
  process.exit(1);
});
