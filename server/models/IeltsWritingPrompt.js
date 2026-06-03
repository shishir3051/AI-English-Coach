import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  taskType: { type: String, enum: ['task1_academic', 'task1_general', 'task2', 'general'] },
  title: String,
  prompt: String,
});

export default mongoose.model('IeltsWritingPrompt', schema);
