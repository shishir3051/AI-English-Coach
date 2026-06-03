/**
 * Import IELTS listening, reading, and writing prompts into MongoDB.
 *
 * Usage (from server/):
 *   npm run import:ielts
 *
 * Add more tests: drop JSON files in server/data/ielts/listening/ or reading/
 * then run this script again (upserts by testId).
 */
import {
  connectMongoFromEnv,
  importIeltsTestsToDb,
  collectIeltsContent,
} from '../lib/ieltsImport.js';

async function main() {
  const preview = collectIeltsContent();
  console.log('📦 IELTS content to import:');
  console.log(`   Listening: ${preview.listening.length} tests`);
  console.log(`   Reading:   ${preview.reading.length} tests`);
  console.log(`   Writing:   ${preview.writing.length} prompts`);

  await connectMongoFromEnv();
  const stats = await importIeltsTestsToDb();

  console.log('✅ Import complete (upserted):');
  console.log(`   Listening: ${stats.listening}`);
  console.log(`   Reading:   ${stats.reading}`);
  console.log(`   Writing:   ${stats.writing}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message);
  process.exit(1);
});
