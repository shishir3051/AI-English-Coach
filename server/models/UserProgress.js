import mongoose from 'mongoose';

const correctionSchema = new mongoose.Schema({
  original: String,
  corrected: String,
  explanation: String,
  betterNative: String,
  confidenceScore: Number,
  timestamp: { type: Date, default: Date.now },
});

const wordSchema = new mongoose.Schema({
  word: String,
  meaning: String,
  pronunciation: String,
  example: String,
  learnedAt: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema({
  topicId: String,
  topicName: String,
  score: Number,
  totalQuestions: Number,
  bestScore: Number,
  completedAt: { type: Date, default: Date.now },
});

const ieltsSkillSchema = new mongoose.Schema(
  {
    band: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null },
  },
  { _id: false }
);

const ieltsAttemptSchema = new mongoose.Schema({
  skill: { type: String, enum: ['listening', 'reading', 'writing', 'speaking'] },
  taskType: String,
  bands: mongoose.Schema.Types.Mixed,
  feedback: String,
  completedAt: { type: Date, default: Date.now },
});

const writingAttemptSchema = new mongoose.Schema({
  taskType: { type: String, default: 'general' },
  wordCount: Number,
  bands: mongoose.Schema.Types.Mixed,
  scores: mongoose.Schema.Types.Mixed,
  completedAt: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
    confidenceScore: { type: Number, default: 0 },
    correctionsCount: { type: Number, default: 0 },
    wordsLearned: [wordSchema],
    corrections: [correctionSchema],
    quizzes: [quizSchema],
    writingAttempts: [writingAttemptSchema],
    completedChallenges: [
      {
        date: String,
        type: String,
        score: Number,
        completedAt: { type: Date, default: Date.now },
      },
    ],
    ielts: {
      targetBand: { type: Number, default: 6.5 },
      overallBand: { type: Number, default: 0 },
      skills: {
        listening: { type: ieltsSkillSchema, default: () => ({}) },
        reading: { type: ieltsSkillSchema, default: () => ({}) },
        writing: { type: ieltsSkillSchema, default: () => ({}) },
        speaking: { type: ieltsSkillSchema, default: () => ({}) },
      },
      attempts: [ieltsAttemptSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserProgress', progressSchema);
