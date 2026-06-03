import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Routes (shared from server/)
import coachRoutes from '../server/routes/coach.js';
import progressRoutes from '../server/routes/progress.js';
import grammarRoutes from '../server/routes/grammar.js';
import challengesRoutes from '../server/routes/challenges.js';
import coachModesRoutes from '../server/routes/coachModes.js';
import wordsRoutes from '../server/routes/words.js';
import sessionsRoutes from '../server/routes/sessions.js';
import vocabularyRoutes from '../server/routes/vocabulary.js';
import ieltsRoutes from '../server/routes/ielts.js';

// Load .env from server/ for local dev (Vercel uses dashboard env vars)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../server/.env') });

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
// Allow the Vercel-deployed frontend, localhost, and any custom CLIENT_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/,          // allow all *.vercel.app subdomains
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, Vercel preview links)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    callback(null, allowed ? true : new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));

// ─── MongoDB Connection (cached for serverless warm-starts) ────────────────
let cachedConn = null;

async function connectToDatabase() {
  if (cachedConn && mongoose.connection.readyState === 1) return cachedConn;
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — running without database.');
    return null;
  }
  cachedConn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB connected (serverless)');
  return cachedConn;
}

// Connect before every request
app.use(async (_req, _res, next) => {
  try { await connectToDatabase(); } catch (e) { console.error('DB error:', e.message); }
  next();
});

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '2.1.0',
    runtime: 'vercel-serverless',
    features: {
      ieltsProgress: true,
      ieltsTests: true,
      analyzeWriting: true,
    },
  });
});

// ─── Register routes ──────────────────────────────────────────────────────
app.use('/api/coach',       coachRoutes);
app.use('/api/progress',    progressRoutes);
app.use('/api/grammar',     grammarRoutes);
app.use('/api/challenges',  challengesRoutes);
app.use('/api/coach-modes', coachModesRoutes);
app.use('/api/words',       wordsRoutes);
app.use('/api/sessions',    sessionsRoutes);
app.use('/api/vocabulary',  vocabularyRoutes);
app.use('/api/ielts',       ieltsRoutes);

// ─── Export for Vercel serverless ─────────────────────────────────────────
export default app;
