/** Shared progress helpers for streak and IELTS tracking */

export async function updateActivityStreak(progress) {
  const now = new Date();

  if (!progress.lastActive) {
    progress.streak = 1;
  } else {
    const last = new Date(progress.lastActive);
    const diff = Math.floor(
      (now.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0)) / 86400000
    );
    if (diff === 1) progress.streak += 1;
    else if (diff > 1) progress.streak = 1;
  }

  progress.lastActive = new Date();
}

export function ensureIelts(progress) {
  if (!progress.ielts) {
    progress.ielts = {
      targetBand: 6.5,
      overallBand: 0,
      skills: {
        listening: { band: 0, lastAttemptAt: null },
        reading: { band: 0, lastAttemptAt: null },
        writing: { band: 0, lastAttemptAt: null },
        speaking: { band: 0, lastAttemptAt: null },
      },
      attempts: [],
    };
  }
  return progress.ielts;
}

export function recordIeltsAttempt(progress, { skill, taskType, bands, feedback }) {
  const ielts = ensureIelts(progress);
  const overall =
    bands?.overall ??
    averageBand([
      bands?.fluency,
      bands?.lexical,
      bands?.grammar,
      bands?.pronunciation,
      bands?.taskAchievement,
      bands?.taskResponse,
      bands?.coherence,
      bands?.lexicalResource,
      bands?.grammaticalRange,
    ]);

  ielts.attempts.push({
    skill,
    taskType: taskType || skill,
    bands: { ...bands, overall: overall || bands?.overall },
    feedback: feedback || '',
    completedAt: new Date(),
  });

  if (ielts.attempts.length > 50) {
    ielts.attempts = ielts.attempts.slice(-50);
  }

  if (skill && ielts.skills[skill]) {
    const bandVal = overall || bands?.overall || 0;
    if (bandVal > 0) {
      ielts.skills[skill].band = bandVal;
      ielts.skills[skill].lastAttemptAt = new Date();
    }
  }

  const skillBands = ['listening', 'reading', 'writing', 'speaking']
    .map((s) => ielts.skills[s]?.band)
    .filter((b) => b > 0);
  if (skillBands.length > 0) {
    ielts.overallBand =
      Math.round((skillBands.reduce((a, b) => a + b, 0) / skillBands.length) * 2) / 2;
  }

  return ielts;
}

function averageBand(values) {
  const nums = values.filter((v) => typeof v === 'number' && v > 0);
  if (nums.length === 0) return 0;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.round(avg * 2) / 2;
}

export async function getOrCreateProgress(userId) {
  const UserProgress = (await import('../models/UserProgress.js')).default;
  let progress = await UserProgress.findOne({ userId });
  if (!progress) {
    progress = await UserProgress.create({ userId });
  }
  ensureIelts(progress);
  return progress;
}
