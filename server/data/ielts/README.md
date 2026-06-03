# IELTS practice content (MongoDB — like Vocabulary)

The app **reads tests from MongoDB**, not from this folder at runtime.  
This folder is where you **add new content**, then **import** it — same idea as loading thousands of vocabulary rows into the `vocabulary` collection.

## Layout

```
server/data/ielts/
  README.md                 ← you are here
  listening/                ← optional: one JSON file per listening test
    listen-11.json
  reading/                  ← optional: one JSON file per reading test
    read-11.json
  writing-prompts.json      ← optional: array of extra writing prompts
```

Built-in tests also live in `server/data/ieltsTestsSeed.js`. The import script merges **seed file + JSON files** and upserts into MongoDB.

## Add a new listening test

1. Create `server/data/ielts/listening/listen-11.json`:

```json
{
  "testId": "listen-11",
  "title": "Train Station Announcement",
  "audioUrl": "",
  "transcript": "The 10:15 express to London will depart from platform 4. Passengers should arrive ten minutes early.",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Which platform?",
      "options": ["2", "3", "4", "5"],
      "answer": 2
    }
  ]
}
```

2. From `server/` run:

```bash
npm run import:ielts
```

3. Restart is **not** required. Open **IELTS → Listening** in the app — the new test appears.

## Add a new reading test

Same pattern under `server/data/ielts/reading/read-11.json` with `testId`, `title`, `passages[]`, and `questions[]` (each question needs `passageIndex`, `options`, `answer` as option index 0–3).

## Writing prompts

Add entries to `writing-prompts.json`:

```json
[
  {
    "taskType": "task2",
    "title": "Essay — public transport",
    "prompt": "Some cities make public transport free. Do the advantages outweigh the disadvantages?"
  }
]
```

Then run `npm run import:ielts`.

## Rules

- `testId` must be **unique** (e.g. `listen-11`, `read-11`).
- Re-running import **updates** existing tests with the same `testId` (safe to edit JSON and import again).
- Do **not** copy real Cambridge IELTS exam text — use original practice content only.
- Without MongoDB, the API falls back to the built-in seed file (limited offline mode).

## Vocabulary comparison

| Vocabulary bank | IELTS tests |
|-----------------|-------------|
| Words live in MongoDB `vocabulary` collection | Tests live in `ieltlisteningtests` / `ieltsreadingtests` |
| Loaded via external import / Atlas | Loaded via `npm run import:ielts` + JSON files |
| App only queries the API | App only queries `/api/ielts/listening` and `/api/ielts/reading` |
