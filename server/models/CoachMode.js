import mongoose from 'mongoose';

const coachModeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  greetingTemplate: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('CoachMode', coachModeSchema);
