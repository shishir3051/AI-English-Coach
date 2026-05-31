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
    motivation: String
  },
  timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  mode: { type: String, required: true },
  messages: [messageSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
