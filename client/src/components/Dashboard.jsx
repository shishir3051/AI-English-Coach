import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Award, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Volume2, 
  TrendingUp, 
  Sparkles,
  Bookmark,
  ChevronRight,
  Loader2,
  RefreshCw,
  Target,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axios from 'axios';

const FALLBACK_WORDS = [
  { word: "Resilient", phonetic: "/rɪˈzɪl.jənt/", meaning: "Able to withstand or recover quickly from difficult conditions.", example: "She is a resilient girl who never gives up.", bangla: "সহনশীল — যে বা যা কঠিন পরিস্থিতিতেও ভেঙে না পড়ে।", category: "adjective" },
  { word: "Exquisite", phonetic: "/ɪkˈskwɪz.ɪt/", meaning: "Extremely beautiful and delicate.", example: "The designer showcased an exquisite collection of dresses.", bangla: "অতীব সুন্দর — অত্যন্ত সূক্ষ্ম ও আকর্ষণীয়।", category: "adjective" },
  { word: "Pragmatic", phonetic: "/præɡˈmæt.ɪk/", meaning: "Dealing with things sensibly and realistically based on practical considerations.", example: "We need a pragmatic approach to solve this issue.", bangla: "বাস্তববাদী — যিনি কার্যত ও বাস্তবসম্মতভাবে চিন্তা করেন।", category: "adjective" },
  { word: "Meticulous", phonetic: "/məˈtɪk.jə.ləs/", meaning: "Showing great attention to detail; very careful and precise.", example: "The accountant was meticulous in checking the records.", bangla: "সূক্ষ্মদর্শী — যিনি প্রতিটি বিষয়ে অত্যন্ত মনোযোগী ও নিখুঁত।", category: "adjective" },
  { word: "Eloquent", phonetic: "/ˈel.ə.kwənt/", meaning: "Fluent or persuasive in speaking or writing.", example: "Her eloquent speech moved the entire audience to tears.", bangla: "বাগ্মী — যিনি সুন্দর ও প্রভাবশালীভাবে বলতে বা লিখতে পারেন।", category: "adjective" },
  { word: "Ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", meaning: "Open to more than one interpretation; not clear in meaning.", example: "The politician gave an ambiguous answer to avoid controversy.", bangla: "দ্ব্যর্থবোধক — যার অর্থ স্পষ্ট নয়, একাধিক অর্থ হতে পারে।", category: "adjective" },
  { word: "Tenacious", phonetic: "/təˈneɪ.ʃəs/", meaning: "Holding firmly to something; very determined.", example: "Her tenacious spirit helped her finish the marathon.", bangla: "অদম্য — যিনি লক্ষ্য অর্জনে দৃঢ়প্রতিজ্ঞ।", category: "adjective" },
  { word: "Ephemeral", phonetic: "/ɪˈfem.ər.əl/", meaning: "Lasting for a very short time; transient.", example: "Fame can be ephemeral if not backed by consistent hard work.", bangla: "ক্ষণস্থায়ী — যা অল্প সময়ের জন্য থাকে।", category: "adjective" },
  { word: "Articulate", phonetic: "/ɑːˈtɪk.jə.lɪt/", meaning: "Having or showing the ability to speak fluently and coherently.", example: "She was articulate in presenting her ideas to the board.", bangla: "স্পষ্টভাষী — যিনি সুস্পষ্ট ও প্রবাহমানভাবে কথা বলতে পারেন।", category: "adjective" },
  { word: "Diligent", phonetic: "/ˈdɪl.ɪ.dʒənt/", meaning: "Having or showing care and conscientiousness in one's work or duties.", example: "A diligent student always reviews notes after class.", bangla: "পরিশ্রমী — যিনি নিষ্ঠার সাথে কাজ করেন।", category: "adjective" },
  { word: "Persevere", phonetic: "/ˌpɜː.sɪˈvɪər/", meaning: "Continue in a course of action even in the face of difficulty.", example: "She persevered through all hardships to achieve her dream.", bangla: "অধ্যবসায় করা — বাধা সত্ত্বেও চেষ্টা চালিয়ে যাওয়া।", category: "verb" },
  { word: "Coherent", phonetic: "/koʊˈhɪr.ənt/", meaning: "Logical and consistent; easy to understand.", example: "Please give a coherent explanation of your plan.", bangla: "সুসংগত — যা যুক্তিসঙ্গত ও সহজে বোঝা যায়।", category: "adjective" },
  { word: "Profound", phonetic: "/prəˈfaʊnd/", meaning: "Very great or intense; having deep meaning.", example: "Her words had a profound impact on everyone present.", bangla: "গভীর — যা অত্যন্ত তীব্র বা গভীর অর্থবহ।", category: "adjective" },
  { word: "Versatile", phonetic: "/ˈvɜː.sə.taɪl/", meaning: "Able to adapt or be adapted to many different functions or activities.", example: "A versatile employee can handle multiple tasks efficiently.", bangla: "বহুমুখী — যিনি বিভিন্ন কাজে দক্ষ ও মানিয়ে নিতে পারেন।", category: "adjective" },
  { word: "Concise", phonetic: "/kənˈsaɪs/", meaning: "Giving a lot of information clearly and in a few words.", example: "Write a concise summary of the report in two paragraphs.", bangla: "সংক্ষিপ্ত — যা অল্প কথায় অনেক কিছু বলে।", category: "adjective" },
];

export default function Dashboard({ progress, navigateToChat, setCurrentView }) {
  const [dailyWord, setDailyWord] = useState(null);
  const [wordLoading, setWordLoading] = useState(true);

  // Fetch word of the day from DB
  useEffect(() => {
    const fetchDailyWord = async () => {
      setWordLoading(true);
      try {
        const res = await axios.get('/api/words/daily');
        setDailyWord(res.data);
      } catch (err) {
        console.warn('Could not load daily word from DB, using fallback.', err.message);
        setDailyWord({
          word: "Resilient",
          phonetic: "/rɪˈzɪl.jənt/",
          meaning: "Able to withstand or recover quickly from difficult conditions.",
          example: "She is a resilient girl who never gives up.",
          bangla: "সহনশীল — যে বা যা কঠিন পরিস্থিতিতেও ভেঙে না পড়ে।"
        });
      } finally {
        setWordLoading(false);
      }
    };
    fetchDailyWord();
  }, []);

  const refreshWord = useCallback(async () => {
    setWordLoading(true);
    try {
      const res = await axios.get('/api/words/random');
      setDailyWord(res.data);
    } catch (err) {
      console.error('Error fetching random word:', err);
      const randomIdx = Math.floor(Math.random() * FALLBACK_WORDS.length);
      setDailyWord(FALLBACK_WORDS[randomIdx]);
    } finally {
      setWordLoading(false);
    }
  }, []);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const { chartData, chartHasQuizData, chartIsEmpty } = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const quizzes = progress.quizzes || [];
    const corrections = progress.corrections || [];
    const hasQuizData = quizzes.length > 0;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const rows = last7Days.map((date) => {
      const dateStr = date.toDateString();
      const dayQuizzes = quizzes.filter((q) => {
        if (!q.completedAt) return false;
        const qDate = new Date(q.completedAt);
        qDate.setHours(0, 0, 0, 0);
        return qDate.toDateString() === dateStr;
      });

      let score = null;
      if (dayQuizzes.length > 0) {
        const avg =
          dayQuizzes.reduce((sum, q) => {
            const total = q.totalQuestions || 1;
            return sum + (q.score / total) * 100;
          }, 0) / dayQuizzes.length;
        score = Math.round(avg);
      }

      const dayCorrections = corrections.filter((c) => {
        if (!c.timestamp) return false;
        const cDate = new Date(c.timestamp);
        cDate.setHours(0, 0, 0, 0);
        return cDate.toDateString() === dateStr;
      }).length;

      if (score === null) {
        score = progress.confidenceScore ?? 0;
      }

      return {
        name: dayNames[date.getDay()],
        Score: score,
        Corrections: dayCorrections,
        hasQuiz: dayQuizzes.length > 0,
      };
    });

    const isEmpty =
      quizzes.length === 0 &&
      corrections.length === 0 &&
      (progress.confidenceScore ?? 0) === 0;

    return { chartData: rows, chartHasQuizData: hasQuizData, chartIsEmpty: isEmpty };
  }, [progress]);

  const ielts = progress?.ielts;
  const ieltsSkills = ielts?.skills || {};

  return (
    <div className="flex-1 min-h-0 space-y-5 overflow-y-auto pr-1 pb-24 lg:pb-2">
      
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-brand-500/20 shadow-xl shadow-brand-500/5">
        <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs px-3 py-1 rounded-full font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Your Expression
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-brand-400 to-violet-300 bg-clip-text text-transparent">Communicator</span>!
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your current conversational confidence is improving. Practice speaking in IELTS Mode or draft a professional email to lock in your daily training streak.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 z-10">
          <button 
            onClick={() => navigateToChat('Intermediate')}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-600/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Speaking
          </button>
          <button 
            onClick={() => setCurrentView('writing')}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all hover:scale-[1.02]"
          >
            Check Essay
          </button>
        </div>
      </div>

      {/* IELTS skill summary */}
      {ielts && (
        <div className="glass-card p-5 rounded-2xl border-brand-500/20">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" />
              IELTS Band Estimates
            </h3>
            <button
              type="button"
              onClick={() => setCurrentView('ielts')}
              className="text-xs font-bold text-brand-400 hover:text-brand-300"
            >
              Open Progress Hub →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Overall', val: ielts.overallBand },
              { label: 'Listening', val: ieltsSkills.listening?.band },
              { label: 'Reading', val: ieltsSkills.reading?.band },
              { label: 'Writing', val: ieltsSkills.writing?.band },
              { label: 'Speaking', val: ieltsSkills.speaking?.band },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-brand-900/50 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">{s.label}</span>
                <span className="text-xl font-black text-brand-300">{s.val ?? '—'}</span>
              </div>
            ))}
          </div>
          {ielts.targetBand && (
            <p className="text-xs text-gray-500 mt-3">
              Target band: <span className="text-white font-bold">{ielts.targetBand}</span>
            </p>
          )}
        </div>
      )}

      {/* Stats Panel Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Competency', val: `${progress.confidenceScore}%`, color: 'text-brand-400', desc: 'Syntax and grammar precision' },
          { label: 'Vocabulary Bank', val: progress.wordsLearned?.length || 0, color: 'text-violet-400', desc: 'Words and idioms mastered' },
          { label: 'Total Corrections', val: progress.correctionsCount || 0, color: 'text-rose-400', desc: 'Grammar errors addressed' },
          { label: 'Active Streak', val: `${progress.streak || 0} days`, color: 'text-amber-400', desc: 'Consecutive training days' }
        ].map((stat, i) => (
          <div key={i} className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">{stat.label}</span>
            <div className="my-3">
              <span className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.val}</span>
            </div>
            <span className="text-xs text-gray-400 leading-snug">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Chart & Word of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Chart */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-gray-400">Weekly Progress Graph</h3>
              <p className="text-xs text-gray-500">
                {chartHasQuizData ? 'Daily quiz % (violet) and correction count (rose)' : 'Confidence % when no quiz data yet'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
              <TrendingUp className="w-4 h-4" />
              {chartHasQuizData ? 'From your progress' : 'Estimated trend'}
            </div>
          </div>

          {chartIsEmpty && (
            <p className="text-xs text-gray-500 mb-2">
              Complete a grammar quiz or chat with the coach to populate this graph.
            </p>
          )}
          
          <div className="h-60 w-full mt-2 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[0, 100]} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                  formatter={(value, name) => [
                    name === 'Score' ? `${value}%` : value,
                    name === 'Score' ? 'Grammar score' : 'Corrections',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="Score"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Corrections"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  yAxisId="right"
                />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Word of the Day — from DB */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none" aria-hidden="true">
            <Bookmark className="w-32 h-32 text-brand-500 fill-brand-500" />
          </div>

          {wordLoading ? (
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
          ) : dailyWord ? (
            <>
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wider">WORD OF THE DAY</span>
                  <div className="flex items-center gap-1 shrink-0 relative z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        refreshWord();
                      }}
                      disabled={wordLoading}
                      className="p-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 hover:text-white border border-white/15 transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      title="New random word"
                      aria-label="Refresh word of the day"
                    >
                      <RefreshCw className={`w-4 h-4 ${wordLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSpeak(dailyWord.word);
                      }}
                      className="p-2 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Listen pronunciation"
                      aria-label="Play pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-2xl font-black text-white tracking-wide">{dailyWord.word}</h4>
                  <p className="text-xs font-mono text-gray-500">{dailyWord.phonetic}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">{dailyWord.meaning}</p>
                  {dailyWord.bangla && (
                    <p className="text-xs text-brand-300/70 font-medium leading-relaxed">{dailyWord.bangla}</p>
                  )}
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 italic">&ldquo;{dailyWord.example}&rdquo;</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSpeak(`${dailyWord.word}. Meaning: ${dailyWord.meaning}`)}
                className="relative z-10 w-full mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl border border-white/10 transition-all text-gray-300 hover:text-white cursor-pointer"
              >
                Play Speech Audio
              </button>
            </>
          ) : (
            <p className="text-xs text-gray-500 text-center">Could not load word of the day.</p>
          )}
        </div>
      </div>

      {/* Learning Modules Launcher */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold tracking-wide uppercase text-gray-400">Personalized Training Classrooms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'IELTS Assessment Mode', desc: 'Mock exams based on official criteria (0-9 Band scores).', action: () => navigateToChat('IELTS'), badge: 'Standard Grade' },
            { title: 'Job Interview Simulation', desc: 'Practice tough situational questions and build confidence.', action: () => navigateToChat('Professional'), badge: 'Business Prep' },
            { title: 'Quick Fluency Sprint', desc: 'Fast-paced, conversational dialogue to improve spontaneous speech.', action: () => navigateToChat('Fast Speaking'), badge: 'Oral Speed' }
          ].map((mode, idx) => (
            <div key={idx} className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{mode.badge}</span>
                </div>
                <h4 className="text-base font-extrabold text-white">{mode.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{mode.desc}</p>
              </div>
              <button 
                onClick={mode.action}
                className="w-full flex items-center justify-between py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl text-gray-300 hover:text-white group transition-all"
              >
                Launch Simulation
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Ledger — from user progress in DB */}
      {progress.wordsLearned && progress.wordsLearned.length > 0 && (
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-gray-400">Vocabulary Bank ({progress.wordsLearned.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {progress.wordsLearned.map((w, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSpeak(w.word)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <span>{w.word}</span>
                <Volume2 className="w-3.5 h-3.5 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
