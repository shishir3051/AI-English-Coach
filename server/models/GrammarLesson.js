import mongoose from 'mongoose';

const quizItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const grammarLessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  letter: { type: String, required: true },
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  examples: [{ type: String }],
  quiz: [quizItemSchema],
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('GrammarLesson', grammarLessonSchema);
