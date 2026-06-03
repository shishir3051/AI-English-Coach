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
import ieltsRoutes from './routes/ielts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend local development
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// MongoDB Connection with fallback
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('✅ Successfully connected to MongoDB.');
      try {
        const { importIeltsTestsToDb } = await import('./lib/ieltsImport.js');
        const IeltsListeningTest = (await import('./models/IeltsListeningTest.js')).default;
        const count = await IeltsListeningTest.countDocuments();
        if (count === 0) {
          const stats = await importIeltsTestsToDb();
          console.log(`✓ IELTS tests imported: ${stats.listening} listening, ${stats.reading} reading, ${stats.writing} writing prompts`);
        }
      } catch (e) {
        console.warn('⚠️ IELTS import skipped:', e.message);
      }
    })
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
    version: '2.1.0',
    features: {
      ieltsProgress: true,
      ieltsTests: true,
      analyzeWriting: true,
    },
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
app.use('/api/ielts', ieltsRoutes);

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
  console.log(`   GET  /api/progress/ielts`);
  console.log(`   PUT  /api/progress/ielts/target`);
  console.log(`   GET  /api/ielts/listening (${10} practice tests)`);
  console.log(`   GET  /api/ielts/reading (${10} practice tests)`);
  console.log(`   GET  /api/ielts/writing-prompts`);
  console.log(`   POST /api/ielts/import  (reload tests from data files)`);
  console.log(`   POST /api/coach/analyze-writing`);
  console.log(`   POST /api/coach/chat`);
  console.log(`   GET  /api/coach/transcribe`);
  console.log(`   POST /api/coach/transcribe`);
  console.log(`   POST /api/sessions`);
  console.log(`   GET  /api/vocabulary`);
});
