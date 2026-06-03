import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: Number,
  passageIndex: Number,
  question: String,
  options: [String],
  answer: Number,
});

const schema = new mongoose.Schema({
  testId: { type: String, unique: true },
  title: String,
  passages: [{ title: String, body: String }],
  questions: [questionSchema],
});

export default mongoose.model('IeltsReadingTest', schema);
