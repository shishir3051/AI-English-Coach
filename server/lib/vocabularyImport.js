import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vocabulary from '../models/Vocabulary.js';
import { normalizePartOfSpeech, buildPartOfSpeechFilter } from '../utils/partOfSpeech.js';
import {
  VOCABULARY_SUPPLEMENT_SEED,
  supplementSeedStats,
} from '../data/vocabularySupplementSeed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_DIR = path.join(__dirname, '../data/vocabulary');

function readJsonSupplements() {
  if (!fs.existsSync(JSON_DIR)) return [];
  const rows = [];
  for (const file of fs.readdirSync(JSON_DIR)) {
    if (!file.endsWith('.json') || file.includes('.example')) continue;
    const parsed = JSON.parse(fs.readFileSync(path.join(JSON_DIR, file), 'utf8'));
    if (Array.isArray(parsed)) rows.push(...parsed);
    else if (parsed?.words && Array.isArray(parsed.words)) rows.push(...parsed.words);
  }
  return rows;
}

export function collectVocabularySupplement() {
  const fromJson = readJsonSupplements();
  const map = new Map();

  for (const row of [...VOCABULARY_SUPPLEMENT_SEED, ...fromJson]) {
    if (!row?.english?.trim()) continue;
    const partOfSpeech = normalizePartOfSpeech(row.partOfSpeech) || row.partOfSpeech || 'noun';
    const key = `${row.english.trim().toLowerCase()}::${partOfSpeech}`;
    map.set(key, { ...row, english: row.english.trim(), partOfSpeech });
  }

  return [...map.values()];
}

export async function connectMongoFromEnv() {
  dotenv.config();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing in server/.env');
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
}

/**
 * Insert supplement rows only when no matching english+partOfSpeech exists.
 */
export async function importVocabularySupplementToDb() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected. Set MONGODB_URI and try again.');
  }

  const rows = collectVocabularySupplement();
  const stats = { inserted: 0, skipped: 0, byPart: {} };

  for (const row of rows) {
    const english = row.english.trim();
    const partOfSpeech = normalizePartOfSpeech(row.partOfSpeech) || row.partOfSpeech;
    const existing = await Vocabulary.findOne({
      english: new RegExp(`^${escapeRegex(english)}$`, 'i'),
      ...buildPartOfSpeechFilter(partOfSpeech),
    }).lean();

    if (existing) {
      stats.skipped += 1;
      continue;
    }

    await Vocabulary.create({
      english,
      bangla: row.bangla,
      pronunciation: row.pronunciation || '',
      partOfSpeech,
      example: row.example || '',
      exampleBangla: row.exampleBangla || '',
      category: row.category || 'Everyday',
      difficulty: row.difficulty || 'beginner',
      synonyms: row.synonyms || [],
    });

    stats.inserted += 1;
    stats.byPart[partOfSpeech] = (stats.byPart[partOfSpeech] || 0) + 1;
  }

  return stats;
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export { supplementSeedStats, VOCABULARY_SUPPLEMENT_SEED };
