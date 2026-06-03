# Lumina — AI English Coach & IELTS Trainer

Lumina is a full-stack English learning platform built for learners who want confident everyday English and structured **IELTS preparation**. It combines a bilingual (English–Bangla) curriculum, a large vocabulary bank, AI coaching powered by **Google Gemini**, and progress tracking across grammar, speaking, writing, listening, and reading.

The product name shown in the app is **LUMINA AI Coach**.

---

## What Lumina offers

### AI Coach (7 training modes)

Practice conversation with an AI coach that corrects grammar, suggests more natural phrasing, and gives pronunciation and vocabulary tips.

| Mode | Purpose |
|------|---------|
| Beginner | Simple, slow English with clear explanations |
| Intermediate | Natural conversation and gentle corrections |
| Advanced | Complex topics and richer vocabulary |
| IELTS | Examiner-style speaking with **band scores** (fluency, lexical, grammar, pronunciation) |
| Kids | Playful, easy language |
| Professional | Business English and interview-style practice |
| Fast Speaking | Quick replies and connected speech |

Voice features include browser speech-to-text, optional server-side transcription (Gemini), and text-to-speech for coach replies. **Chat history** only stores sessions where you sent at least one message (greeting-only visits are not saved).

### IELTS preparation (four skills)

- **Speaking** — IELTS mode in AI Coach; Parts 1–3 flow with band feedback and mock completion
- **Writing** — Task 1 (Academic / General) and Task 2 essays with rubric-style bands (TA, CC, LR, GRA)
- **Listening** — Practice tests with transcript (TTS playback) and scored MCQs
- **Reading** — Academic-style passages with scored questions
- **IELTS Progress Hub** — Target band, per-skill estimates, and recent attempt history

Built-in catalog: **10 listening** and **10 reading** practice tests (original content). More tests can be added via JSON import (see below).

### Grammar A–Z

Bilingual grammar lessons (English + Bangla) with interactive quizzes, mastery indicators on the lesson grid, and links to IELTS-relevant topics (articles, conditionals, relative clauses, and more). Quiz results update your confidence score and activity streak.

### Vocabulary Bank

Searchable English–Bangla word bank stored in MongoDB (typically thousands of entries when the database is populated). Filter by category, difficulty, and part of speech; listen to pronunciation. **Add with AI**: type any English word beside Search — Gemini fills Bangla meaning, examples, and pronunciation, saves to the dictionary, and shows it in the grid.

### Daily Challenges & Dashboard

Daily challenge types (spot-the-error, synonyms, sentence tasks), streak tracking across quizzes and IELTS activity, weekly progress charts, and word-of-the-day style discovery.

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (Atlas or local) |
| AI | Google Generative AI SDK (`gemini-2.5-flash`) |
| Voice | Web Speech API; server transcribe via Gemini when needed |
| Deploy | Vercel (static client + serverless API in `api/`) |

---

## Project structure

```
ai-english-coach/
├── client/                 # React SPA (Vite)
│   └── src/components/     # Dashboard, AICoach, IELTS*, Grammar, Vocab, etc.
├── server/                 # Express API (local dev)
│   ├── routes/             # coach, progress, grammar, ielts, vocabulary, …
│   ├── models/             # Mongoose schemas
│   ├── data/               # Grammar extras, IELTS seeds & JSON import folders
│   ├── lib/ieltsImport.js  # Merge seeds + JSON → MongoDB
│   └── scripts/            # import-ielts-tests, kill-port
├── api/                    # Vercel serverless entry (same routes as server)
└── vercel.json             # SPA + /api rewrites
```

---

## Prerequisites

- **Node.js** 18 or newer
- **MongoDB** connection string (MongoDB Atlas recommended for production)
- **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

Without `MONGODB_URI`, the app uses limited in-memory fallbacks (vocabulary and IELTS lists will be sparse). Without `GEMINI_API_KEY`, the server will not start.

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/shishir3051/AI-English-Coach.git
cd AI-English-Coach
```

### 2. Environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/lumina
GEMINI_API_KEY=your_gemini_api_key
```

Optional for Vercel CORS:

```env
CLIENT_URL=https://your-app.vercel.app
```

### 3. Run backend and frontend together (recommended)

From the repository root:

```bash
npm install
cd server && npm install && cd ../client && npm install && cd ..
npm run dev
```

This starts the API on **http://localhost:5000** and the client on **http://localhost:5173** (Vite proxies `/api` to the backend).

### 4. Run separately

**Backend:**

```bash
cd server
npm install
npm run dev          # nodemon, auto-frees port 5000
# or
npm start            # production-style start
npm run restart      # kill port 5000 + start
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## Deploying on Vercel

1. Connect the GitHub repository to Vercel.
2. Set environment variables in the Vercel project:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` (your production frontend URL, for CORS)
3. Deploy. The build uses `client/`; API routes are served from `api/index.js`.

After deploy, hard-refresh the browser if you still see an old bundle.

---

## Managing content (like Vocabulary)

### Vocabulary

Words live in the MongoDB `vocabulary` collection. The app reads them through `/api/vocabulary`.

**Supplement seed** (fills empty part-of-speech filters — preposition, conjunction, interjection, pronoun, idiom — plus extra verbs/adverbs):

| Step | Action |
|------|--------|
| Seed file | `server/data/vocabularySupplementSeed.js` (~250 entries; re-exported from `server/utils/partOfSpeech.js`) |
| Import | `cd server && npm run import:vocab` |
| More words | Add JSON under `server/data/vocabulary/` (see `server/data/vocabulary/README.md`) |

Import only **adds** new `english` + `partOfSpeech` pairs; it does not overwrite your existing bulk vocabulary.

### IELTS listening, reading, and writing prompts

Tests are stored in MongoDB, not embedded in the React build.

| Step | Action |
|------|--------|
| Add content | Place JSON under `server/data/ielts/listening/` or `reading/` (see `server/data/ielts/README.md`) |
| Import | From `server/`: `npm run import:ielts` |
| Use | Refresh the app → **IELTS Progress** → Listening / Reading |

You can also reload from disk without restarting the server:

```http
POST /api/ielts/import
```

On first connect to an empty database, the server auto-imports the built-in catalog from `server/data/ieltsTestsSeed.js`.

Use **original** practice text only — do not copy copyrighted Cambridge IELTS exam materials.

### Grammar

Lessons are seeded into MongoDB on server start when the grammar collection is empty, with extra topics merged from `server/data/grammarExtras.js`.

---

## Useful npm scripts

| Location | Command | Description |
|----------|---------|-------------|
| Root | `npm run dev` | Run server + client concurrently |
| `server/` | `npm run dev` | API with nodemon |
| `server/` | `npm run start` | API (frees port 5000 first) |
| `server/` | `npm run restart` | Kill port 5000 and restart API |
| `server/` | `npm run import:ielts` | Upsert all IELTS tests into MongoDB |
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production build |

---

## API overview

| Area | Examples |
|------|----------|
| Health | `GET /api/health` |
| Coach | `POST /api/coach/chat`, `POST /api/coach/analyze-writing`, `POST /api/coach/transcribe` |
| Progress | `GET /api/progress`, `GET /api/progress/ielts`, `PUT /api/progress/ielts/target` |
| IELTS | `GET /api/ielts/listening`, `GET /api/ielts/reading`, `POST /api/ielts/import` |
| Grammar | `GET /api/grammar/lessons` |
| Vocabulary | `GET /api/vocabulary`, `GET /api/vocabulary/stats` |
| Sessions | `GET /api/sessions/history/:userId` |

---

## Troubleshooting

**404 on `/api/progress/ielts` or `/api/ielts/*`**

An old Node process may still be running on port 5000 without the new routes. Run:

```bash
cd server
npm run restart
```

Confirm `GET http://localhost:5000/api/health` returns `"version":"2.1.0"` and IELTS feature flags.

**`EADDRINUSE` on port 5000**

Use `npm run restart` in `server/`, or stop the process shown by `netstat -ano | findstr :5000` on Windows.

**Vocabulary bank empty in production**

Set `MONGODB_URI` on Vercel and ensure the `vocabulary` collection is populated in that database.

**IELTS tests not updating after adding JSON**

Run `npm run import:ielts` from `server/`, then refresh the app.

---

## License

MIT License — see repository license file for details.

---

## Author

Developed as an open-source English coaching project. Contributions and issues are welcome via GitHub.
