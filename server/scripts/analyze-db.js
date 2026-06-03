import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const vocabularySchema = new mongoose.Schema({
  english: String,
  bangla: String,
  partOfSpeech: String,
  category: String,
  difficulty: String,
});
const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

async function main() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const total = await Vocabulary.countDocuments();
  console.log(`Total words in DB: ${total}`);

  const counts = await Vocabulary.aggregate([
    {
      $group: {
        _id: { category: '$category', difficulty: '$difficulty' },
        count: { $sum: 1 }
      }
    }
  ]);

  const report = {};
  counts.forEach(c => {
    const cat = c._id.category || 'Unknown';
    const diff = c._id.difficulty || 'beginner';
    if (!report[cat]) {
      report[cat] = { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
    }
    report[cat][diff] = c.count;
    report[cat].total += c.count;
  });

  console.log('\nCategory breakdown in MongoDB:');
  Object.keys(report).sort().forEach(cat => {
    const data = report[cat];
    console.log(`- ${cat}: ${data.total} total (Beg: ${data.beginner}, Int: ${data.intermediate}, Adv: ${data.advanced})`);
  });

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
