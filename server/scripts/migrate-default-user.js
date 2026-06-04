/**
 * Migration Script: Transfer old 'default_user' data to a real user account.
 * Run with: node scripts/migrate-default-user.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const TARGET_EMAIL = 'cptjacksparrow4311@gmail.com'; // rahman shishir's email

if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI in .env');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log('✅ Connected to MongoDB');

const db = mongoose.connection.db;

// 1. Find the target user
const user = await db.collection('users').findOne({ email: TARGET_EMAIL });
if (!user) {
  console.error(`❌ User not found with email: ${TARGET_EMAIL}`);
  process.exit(1);
}

const newUserId = user._id.toString();
console.log(`✅ Found target user: ${user.name} (${newUserId})`);

// 2. Migrate UserProgress
const oldProgress = await db.collection('userprogresses').findOne({ userId: 'default_user' });
const newProgress = await db.collection('userprogresses').findOne({ userId: newUserId });

if (oldProgress) {
  if (newProgress) {
    // Merge old data INTO the new user's progress
    const merged = {
      wordsLearned: [
        ...(newProgress.wordsLearned || []),
        ...(oldProgress.wordsLearned || []),
      ],
      corrections: [
        ...(newProgress.corrections || []),
        ...(oldProgress.corrections || []),
      ],
      quizzes: [
        ...(newProgress.quizzes || []),
        ...(oldProgress.quizzes || []),
      ],
      writingAttempts: [
        ...(newProgress.writingAttempts || []),
        ...(oldProgress.writingAttempts || []),
      ],
      completedChallenges: [
        ...(newProgress.completedChallenges || []),
        ...(oldProgress.completedChallenges || []),
      ],
      correctionsCount: (newProgress.correctionsCount || 0) + (oldProgress.correctionsCount || 0),
      confidenceScore: Math.max(newProgress.confidenceScore || 0, oldProgress.confidenceScore || 0),
      streak: Math.max(newProgress.streak || 0, oldProgress.streak || 0),
    };

    await db.collection('userprogresses').updateOne(
      { userId: newUserId },
      { $set: merged }
    );
    // Delete old default_user progress
    await db.collection('userprogresses').deleteOne({ userId: 'default_user' });
    console.log('✅ Merged old progress into rahman shishir\'s account and deleted default_user progress.');
  } else {
    // No existing progress for the new user — just reassign
    await db.collection('userprogresses').updateOne(
      { userId: 'default_user' },
      { $set: { userId: newUserId } }
    );
    console.log('✅ Reassigned UserProgress from default_user to rahman shishir.');
  }
} else {
  console.log('ℹ️  No default_user progress found. Skipping progress migration.');
}

// 3. Migrate ChatSessions
const sessionResult = await db.collection('chatsessions').updateMany(
  { userId: 'default_user' },
  { $set: { userId: newUserId } }
);
console.log(`✅ Migrated ${sessionResult.modifiedCount} chat sessions to rahman shishir.`);

console.log('\n🎉 Migration complete! All data is now under rahman shishir\'s account.');
await mongoose.disconnect();
