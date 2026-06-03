import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: Number,
  type: { type: String, default: 'mcq' },
  question: String,
  options: [String],
  answer: Number,
});

const schema = new mongoose.Schema({
  testId: { type: String, unique: true },
  title: String,
  audioUrl: String,
  transcript: String,
  questions: [questionSchema],
});

export default mongoose.model('IeltsListeningTest', schema);
