# Lumina: AI-Powered English Coach & Communication Trainer

Lumina is a premium, interactive English language coach and communication training platform. It leverages advanced generative AI (Google Gemini 2.0 Flash) combined with interactive tools, a 3317-word English-Bangla vocabulary database, structured grammar syllabus lessons, and real-time pronunciation and lexical feedback to accelerate conversational confidence and written accuracy.

---

## 🚀 Key Features

*   **AI Coach Chat**: Practice English in 7 specialized sub-modes (Beginner, Intermediate, Advanced, IELTS Simulation, Kids, Professional, and Fast Speaking) with real-time grammar diagnostics, native expression suggestions, lexical upgrades, and pronunciation tips.
*   **Speech-to-Text & Text-to-Speech**: Full voice integration using the Web Speech API. Practice speaking by clicking the mic, and listen to the coach read replies (with speed automatically adapted to the training mode).
*   **Vocabulary Bank (3,317 Words)**: A comprehensive, searchable database of English words mapped to Bangla definitions. Filterable by difficulty (Beginner, Intermediate, Advanced), category (Science, Medical, Numbers, Geography, etc.), and parts of speech. Features pronunciation playback.
*   **Grammar A to Z**: 25 comprehensive bilingual (English-Bangla) lessons with interactive quizzes that update the user's overall competency score.
*   **Daily Challenges**: Spot-the-error, synonym matcher, and sentence reconstruction tasks designed to test syntax and maintain daily learning streaks.
*   **Writing Checker**: Side-by-side comparative panel to check drafts, essays, or paragraphs for spelling, syntax, and flow.
*   **Progress Dashboard**: Interactive graphing of confidence metrics, streak counters, error rates, and vocabulary banks (using Recharts).

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Lucide icons, Recharts
*   **Backend**: Node.js, Express, MongoDB (Mongoose)
*   **AI Engine**: Google Gen AI SDK (Gemini 2.0 Flash)
*   **Voice Engine**: Web Speech API (transcription & text-to-speech)

---

## ⚙️ Setup & Installation

### Prerequisites

*   Node.js (v18+)
*   MongoDB local instance or Atlas URI

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/shishir3051/AI-English-Coach.git
    cd AI-English-Coach
    ```

2.  **Server Setup**:
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server/` directory and configure:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    ```
    Start the backend server:
    ```bash
    npm start
    ```

3.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

4.  Open the application at **http://localhost:5173** and start learning!

---

## 📝 License

Distributed under the MIT License.
