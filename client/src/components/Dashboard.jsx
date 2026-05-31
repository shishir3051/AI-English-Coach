import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

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

  const refreshWord = async () => {
    setWordLoading(true);
    try {
      const res = await axios.get('/api/words/random');
      setDailyWord(res.data);
    } catch (err) {
      console.warn('Could not fetch random word.', err.message);
    } finally {
      setWordLoading(false);
    }
  };

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

  // Build chart data from real progress (last 7 entries) or mock trend
  const buildChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay(); // 0 = Sun, 1 = Mon...
    
    // Use real quiz scores if available
    if (progress.quizzes && progress.quizzes.length > 0) {
      const recent = progress.quizzes.slice(-7);
      return recent.map((q, i) => ({
        name: days[(today + i) % 7],
        Score: Math.round((q.score / q.totalQuestions) * 100),
        Corrections: progress.correctionsCount
      }));
    }

    // Fallback realistic trending data
    const base = progress.confidenceScore || 60;
    return days.map((name, i) => ({
      name,
      Score: Math.min(100, base - 15 + Math.floor(i * (15 / 6)) + Math.floor(Math.random() * 4)),
      Corrections: Math.max(0, (progress.correctionsCount || 8) - i)
    }));
  };

  const chartData = buildChartData();

  return (
    <div className="flex-1 min-h-0 space-y-5 overflow-y-auto pr-1 pb-2">
      
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
              <p className="text-xs text-gray-500">Grammar competency vs active error counts</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
              <TrendingUp className="w-4 h-4" />
              Tracking Live
            </div>
          </div>
          
          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[30, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Score" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Word of the Day — from DB */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Bookmark className="w-32 h-32 text-brand-500 fill-brand-500" />
          </div>

          {wordLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
          ) : dailyWord ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wider">WORD OF THE DAY</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={refreshWord}
                      className="p-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
                      title="New random word"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleSpeak(dailyWord.word)}
                      className="p-2 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all hover:scale-105 active:scale-95"
                      title="Listen Pronunciation"
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
                onClick={() => handleSpeak(`${dailyWord.word}. Meaning: ${dailyWord.meaning}`)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl border border-white/10 transition-all text-gray-300 hover:text-white"
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
