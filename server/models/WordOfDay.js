import mongoose from 'mongoose';

const wordOfDaySchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, index: true },
  phonetic: { type: String, required: true },
  meaning: { type: String, required: true },
  example: { type: String, required: true },
  bangla: { type: String, default: '' },
  category: { type: String, default: 'general' }
}, { timestamps: true });

export default mongoose.model('WordOfDay', wordOfDaySchema);
