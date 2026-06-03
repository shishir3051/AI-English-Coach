import mongoose from 'mongoose';

const vocabularySchema = new mongoose.Schema({
  english: { type: String, required: true, index: true },
  bangla: { type: String, required: true },
  pronunciation: { type: String, default: '' },
  partOfSpeech: { type: String, default: 'noun', enum: ['noun','verb','adjective','adverb','preposition','conjunction','interjection','pronoun','phrase','idiom'] },
  example: { type: String, default: '' },
  exampleBangla: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  difficulty: { type: String, default: 'beginner', enum: ['beginner','intermediate','advanced'] },
  synonyms: [{ type: String }],
  antonyms: [{ type: String }],
}, { timestamps: true });

// Compound text index for full-text search
vocabularySchema.index({ english: 'text', bangla: 'text' });

export default mongoose.model('Vocabulary', vocabularySchema);
