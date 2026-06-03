# Vocabulary supplement (MongoDB)

Built-in seeds live in `vocabularySupplementSeed.js`. They fill **empty** part-of-speech filters (preposition, conjunction, interjection, pronoun, idiom) and add more verbs, adverbs, and adjectives.

## Import

From `server/`:

```bash
npm run import:vocab
```

- Connects using `MONGODB_URI` in `server/.env`
- **Inserts only** rows that do not already exist (matched by `english` + `partOfSpeech`, case-insensitive)
- Does not change your existing noun/phrase bulk import

## Add more words

Drop a JSON file here (any name ending in `.json`, not `.example`):

```json
[
  {
    "english": "according to",
    "bangla": "অনুযায়ী",
    "partOfSpeech": "preposition",
    "example": "According to the report, sales rose.",
    "exampleBangla": "রিপোর্ট অনুযায়ী বিক্রি বেড়েছে।",
    "category": "Business",
    "difficulty": "intermediate"
  }
]
```

Run `npm run import:vocab` again.
