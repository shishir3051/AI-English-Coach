import mongoose from 'mongoose';

const correctionSchema = new mongoose.Schema({
  original: String,
  corrected: String,
  explanation: String,
  betterNative: String,
  confidenceScore: Number,
  timestamp: { type: Date, default: Date.now }
});

const wordSchema = new mongoose.Schema({
  word: String,
  meaning: String,
  pronunciation: String,
  example: String,
  learnedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  topicId: String,
  topicName: String,
  score: Number,
  totalQuestions: Number,
  completedAt: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user' }, // single-user app default
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: null },
  confidenceScore: { type: Number, default: 0 },
  correctionsCount: { type: Number, default: 0 },
  wordsLearned: [wordSchema],
  corrections: [correctionSchema],
  quizzes: [quizSchema],
  completedChallenges: [{
    date: String, // YYYY-MM-DD
    type: String, // 'grammar', 'vocab', 'error'
    score: Number,
    completedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('UserProgress', progressSchema);
