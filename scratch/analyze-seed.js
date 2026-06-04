import { VOCABULARY_SUPPLEMENT_SEED } from '../server/data/vocabularySupplementSeed.js';

const total = VOCABULARY_SUPPLEMENT_SEED.length;
console.log(`Total seed words: ${total}`);

const difficulties = {};
const categories = {};
const categoryDifficulty = {};

VOCABULARY_SUPPLEMENT_SEED.forEach(word => {
  const diff = word.difficulty || 'beginner';
  const cat = word.category || 'Everyday';
  
  difficulties[diff] = (difficulties[diff] || 0) + 1;
  categories[cat] = (categories[cat] || 0) + 1;
  
  if (!categoryDifficulty[cat]) {
    categoryDifficulty[cat] = { beginner: 0, intermediate: 0, advanced: 0 };
  }
  categoryDifficulty[cat][diff]++;
});

console.log('\nDifficulty counts:');
console.log(difficulties);

console.log('\nCategory counts:');
Object.keys(categories).sort().forEach(cat => {
  console.log(`- ${cat}: ${categories[cat]} total (${JSON.stringify(categoryDifficulty[cat])})`);
});
