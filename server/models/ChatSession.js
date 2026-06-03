import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  correction: {
    original: String,
    corrected: String,
    explanation: String,
    betterNative: String,
    pronunciationTips: String,
    vocabularyUpgrade: String,
    confidenceScore: Number,
    motivation: String,
  },
  ieltsBands: mongoose.Schema.Types.Mixed,
  speakingPart: Number,
  examinerNotes: String,
  timestamp: { type: Date, default: Date.now }
});

const ieltsMockSchema = new mongoose.Schema({
  currentPart: { type: Number, default: 1 },
  questionIndex: { type: Number, default: 0 },
  cueCard: { type: String, default: '' },
  phase: { type: String, default: 'questioning' },
  prepEndsAt: { type: Date, default: null },
  speakEndsAt: { type: Date, default: null },
  lastBands: mongoose.Schema.Types.Mixed,
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  mode: { type: String, required: true },
  messages: [messageSchema],
  ieltsMock: ieltsMockSchema,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
