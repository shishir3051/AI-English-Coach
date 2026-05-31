import mongoose from 'mongoose';

const vocabularyWordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, index: true },
  pronunciation: { type: String, required: true },
  meaning: { type: String, required: true },
  example: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('VocabularyWord', vocabularyWordSchema);
