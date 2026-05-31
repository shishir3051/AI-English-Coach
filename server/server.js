import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import coachRoutes from './routes/coach.js';
import progressRoutes from './routes/progress.js';
import grammarRoutes from './routes/grammar.js';
import challengesRoutes from './routes/challenges.js';
import coachModesRoutes from './routes/coachModes.js';
import wordsRoutes from './routes/words.js';
import sessionsRoutes from './routes/sessions.js';
import vocabularyRoutes from './routes/vocabulary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend local development
app.use(cors());
app.use(express.json());

// MongoDB Connection with fallback
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ Successfully connected to MongoDB.'))
    .catch(err => {
      console.warn('⚠️ MongoDB connection error. The server will use mock-fallback operations.', err.message);
    });
} else {
  console.warn('⚠️ No MONGODB_URI found in env. The server will proceed without persistent database records.');
}

// Global API Status check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '2.0.0'
  });
});

// Register all routers
app.use('/api/coach', coachRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/coach-modes', coachModesRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI English Coach Backend is running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/grammar`);
  console.log(`   GET  /api/challenges/daily`);
  console.log(`   GET  /api/coach-modes`);
  console.log(`   GET  /api/words/daily`);
  console.log(`   GET  /api/progress`);
  console.log(`   POST /api/coach/chat`);
  console.log(`   POST /api/sessions`);
  console.log(`   GET  /api/vocabulary`);
});
