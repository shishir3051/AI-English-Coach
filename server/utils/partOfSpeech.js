/**
 * Part-of-speech helpers for filters and UI.
 *
 * Vocabulary supplement seeds (preposition, conjunction, idiom, etc.):
 *   server/data/vocabularySupplementSeed.js
 * Import into MongoDB: npm run import:vocab (from server/)
 */

/** Canonical part-of-speech values used in filters and UI */
export const CANONICAL_PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'interjection',
  'pronoun',
  'phrase',
  'idiom',
];

export const PART_OF_SPEECH_LABELS = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  interjection: 'Interjection',
  pronoun: 'Pronoun',
  phrase: 'Phrase',
  idiom: 'Idiom',
};

/** Case-insensitive MongoDB filter for a canonical part of speech */
export const PART_OF_SPEECH_FILTER_REGEX = {
  noun: /^nouns?$/i,
  verb: /^verbs?$/i,
  adjective: /^(adjectives?|adj\.?)$/i,
  adverb: /^(adverbs?|adv\.?)$/i,
  preposition: /^(prepositions?|prep\.?)$/i,
  conjunction: /^(conjunctions?|conj\.?)$/i,
  interjection: /^(interjections?|intj\.?)$/i,
  pronoun: /^(pronouns?|pron\.?)$/i,
  phrase: /^phrases?$/i,
  idiom: /^idioms?$/i,
};

const NORMALIZE_PATTERNS = [
  ['noun', PART_OF_SPEECH_FILTER_REGEX.noun],
  ['verb', PART_OF_SPEECH_FILTER_REGEX.verb],
  ['adjective', PART_OF_SPEECH_FILTER_REGEX.adjective],
  ['adverb', PART_OF_SPEECH_FILTER_REGEX.adverb],
  ['preposition', PART_OF_SPEECH_FILTER_REGEX.preposition],
  ['conjunction', PART_OF_SPEECH_FILTER_REGEX.conjunction],
  ['interjection', PART_OF_SPEECH_FILTER_REGEX.interjection],
  ['pronoun', PART_OF_SPEECH_FILTER_REGEX.pronoun],
  ['phrase', PART_OF_SPEECH_FILTER_REGEX.phrase],
  ['idiom', PART_OF_SPEECH_FILTER_REGEX.idiom],
];

/**
 * Map stored DB values (any casing/abbreviation) to a canonical slug, or null if empty.
 */
export function normalizePartOfSpeech(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  const s = String(raw).trim();
  if (CANONICAL_PARTS_OF_SPEECH.includes(s)) return s;
  const lower = s.toLowerCase();
  if (CANONICAL_PARTS_OF_SPEECH.includes(lower)) return lower;
  for (const [canonical, pattern] of NORMALIZE_PATTERNS) {
    if (pattern.test(s)) return canonical;
  }
  return lower;
}

export function partOfSpeechLabel(canonical) {
  return PART_OF_SPEECH_LABELS[canonical] || canonical;
}

/** MongoDB filter clause for `partOfSpeech` query param */
export function buildPartOfSpeechFilter(canonical) {
  const key = normalizePartOfSpeech(canonical) || canonical;
  const regex = PART_OF_SPEECH_FILTER_REGEX[key];
  if (regex) {
    return { partOfSpeech: regex };
  }
  const escaped = String(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { partOfSpeech: new RegExp(`^${escaped}$`, 'i') };
}

/**
 * Roll up aggregate `{ _id, count }` rows into canonical buckets.
 */
export function rollupPartsOfSpeech(rows) {
  const counts = Object.fromEntries(CANONICAL_PARTS_OF_SPEECH.map((k) => [k, 0]));
  let other = 0;

  for (const row of rows || []) {
    const canonical = normalizePartOfSpeech(row._id);
    const n = row.count || 0;
    if (canonical && counts[canonical] !== undefined) {
      counts[canonical] += n;
    } else {
      other += n;
    }
  }

  const options = CANONICAL_PARTS_OF_SPEECH
    .filter((value) => counts[value] > 0)
    .map((value) => ({
      value,
      label: partOfSpeechLabel(value),
      count: counts[value],
    }));

  return { options, other, totalTypes: options.length };
}

export { VOCABULARY_SUPPLEMENT_SEED, supplementSeedStats } from '../data/vocabularySupplementSeed.js';
