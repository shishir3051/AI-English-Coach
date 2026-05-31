import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true, enum: ['error', 'vocab', 'reorder'] },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  sentence: { type: String }, // For 'error' type
  correctAnswer: { type: String }, // For 'error' type
  optionsHint: { type: String }, // For 'error' type
  options: [{ type: String }], // For 'vocab' type
  answerIndex: { type: Number }, // For 'vocab' type
  explanation: { type: String }, // For 'vocab' type
  blocks: [{ type: String }], // For 'reorder' type
  correctSequence: { type: String }, // For 'reorder' type
  points: { type: Number, required: true, default: 10 }
}, { timestamps: true });

export default mongoose.model('DailyChallenge', dailyChallengeSchema);
