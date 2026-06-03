import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IeltsListeningTest from '../models/IeltsListeningTest.js';
import IeltsReadingTest from '../models/IeltsReadingTest.js';
import IeltsWritingPrompt from '../models/IeltsWritingPrompt.js';
import {
  LISTENING_SEED,
  READING_SEED,
  WRITING_PROMPTS_SEED,
} from '../data/ieltsTestsSeed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = path.join(__dirname, '../data/ielts');

function readJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.includes('.example'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      return JSON.parse(raw);
    });
}

export function collectIeltsContent() {
  const listeningDir = path.join(DATA_ROOT, 'listening');
  const readingDir = path.join(DATA_ROOT, 'reading');
  const writingFile = path.join(DATA_ROOT, 'writing-prompts.json');

  const listening = [...LISTENING_SEED];
  const reading = [...READING_SEED];
  let writing = [...WRITING_PROMPTS_SEED];

  for (const doc of readJsonFiles(listeningDir)) {
    if (doc?.testId) listening.push(doc);
  }
  for (const doc of readJsonFiles(readingDir)) {
    if (doc?.testId) reading.push(doc);
  }
  if (fs.existsSync(writingFile)) {
    const extra = JSON.parse(fs.readFileSync(writingFile, 'utf8'));
    if (Array.isArray(extra)) writing = [...writing, ...extra];
  }

  const dedupeByTestId = (arr) => {
    const map = new Map();
    for (const item of arr) {
      if (item?.testId) map.set(item.testId, item);
    }
    return [...map.values()];
  };

  return {
    listening: dedupeByTestId(listening),
    reading: dedupeByTestId(reading),
    writing,
  };
}

export async function importIeltsTestsToDb() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected. Set MONGODB_URI and try again.');
  }

  const { listening, reading, writing } = collectIeltsContent();
  const stats = { listening: 0, reading: 0, writing: 0 };

  for (const doc of listening) {
    await IeltsListeningTest.findOneAndUpdate({ testId: doc.testId }, doc, {
      upsert: true,
      new: true,
    });
    stats.listening += 1;
  }
  for (const doc of reading) {
    await IeltsReadingTest.findOneAndUpdate({ testId: doc.testId }, doc, {
      upsert: true,
      new: true,
    });
    stats.reading += 1;
  }
  for (const doc of writing) {
    await IeltsWritingPrompt.findOneAndUpdate(
      { title: doc.title, taskType: doc.taskType },
      doc,
      { upsert: true, new: true }
    );
    stats.writing += 1;
  }

  return stats;
}

export async function connectMongoFromEnv() {
  dotenv.config();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing in server/.env');
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
}
