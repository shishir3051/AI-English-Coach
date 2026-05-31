import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Trophy, 
  Flame, 
  Target, 
  GraduationCap, 
  Menu, 
  X,
  Volume2,
  Sparkles,
  Info
} from 'lucide-react';
import axios from 'axios';

// Component Imports
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import WritingChecker from './components/WritingChecker';
import GrammarLessons from './components/GrammarLessons';
import DailyChallenges from './components/DailyChallenges';
import VocabularyBook from './components/VocabularyBook';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState({
    userId: 'default_user',
    level: 'Intermediate',
    streak: 3,
    confidenceScore: 78,
    correctionsCount: 12,
    wordsLearned: [
      { word: 'Eloquent', meaning: 'Eloquent (/ˈel.ə.kwənt/): Fluent or persuasive in speaking or writing.', pronunciation: '/ˈel.ə.kwənt/', example: 'His speech was highly eloquent.' },
      { word: 'Coherent', meaning: 'Coherent (/koʊˈhɪr.ənt/): Logical and consistent.', pronunciation: '/koʊˈhɪr.ənt/', example: 'She presented a coherent argument.' }
    ],
    quizzes: [],
    completedChallenges: []
  });
  
  // Specific chat sub-mode state passed to AICoach.jsx
  const [chatMode, setChatMode] = useState('Intermediate');

  // Load progress stats on mount
  const fetchProgress = async () => {
    try {
      const res = await axios.get(`/api/progress?userId=default_user`);
      if (res.data) {
        setProgress(res.data);
      }
    } catch (err) {
      console.warn('Backend not running or DB disconnected. Using client mock progress states.', err.message);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [currentView]);

  const handleLevelChange = async (newLevel) => {
    try {
      const res = await axios.post('/api/progress/level', { level: newLevel });
      if (res.data && res.data.level) {
        setProgress(prev => ({ ...prev, level: res.data.level }));
      }
    } catch (err) {
      // Fallback update on local state if network errors
      setProgress(prev => ({ ...prev, level: newLevel }));
    }
  };

  const navigateToChat = (mode) => {
    setChatMode(mode);
    setCurrentView('chat');
  };

  return (
    <div className="h-screen w-screen bg-brand-900 text-gray-100 flex relative overflow-hidden font-sans">
      {/* Background glow filters */}
      <div className="glow-mesh glow-violet"></div>
      <div className="glow-mesh glow-indigo"></div>

      {/* Sidebar Navigation */}
      <aside className={`shrink-0 w-64 bg-brand-850/80 backdrop-blur-md border-r border-white/5 flex flex-col justify-between z-50
        fixed inset-y-0 left-0 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:inset-auto lg:translate-x-0 lg:transform-none
      `}>
        
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-violet-400 rounded-xl shadow-lg shadow-brand-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-gray-200 to-brand-300 bg-clip-text text-transparent">LUMINA</h1>
                <span className="text-xs text-brand-400 font-medium tracking-widest uppercase">AI Coach</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => navigateToChat('Intermediate')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'chat'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              AI Coach Chat
            </button>

            <button
              onClick={() => setCurrentView('writing')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'writing'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileText className="w-5 h-5" />
              Writing Checker
            </button>

            <button
              onClick={() => setCurrentView('grammar')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'grammar'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Grammar A to Z
            </button>

            <button
              onClick={() => setCurrentView('challenges')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'challenges'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trophy className="w-5 h-5" />
              Daily Challenges
            </button>

            <button
              onClick={() => setCurrentView('vocabulary')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentView === 'vocabulary'
                  ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Vocabulary Bank
            </button>
          </nav>
        </div>

        {/* User Level Select panel */}
        <div className="p-4 border-t border-white/5 bg-brand-900/50">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-brand-400 font-bold tracking-wider uppercase px-1">TRAINING LEVEL</span>
            <div className="grid grid-cols-3 gap-1 bg-brand-900 p-1 rounded-xl border border-white/5">
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`text-[10px] font-bold py-1.5 rounded-lg transition-all ${
                    progress.level === lvl 
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {lvl.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

      </aside>

      {/* Main Workspace Panel */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        
        {/* Top Header Dashboard */}
        <header className="shrink-0 h-16 border-b border-white/5 flex items-center justify-between px-6 bg-brand-900/40 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs bg-brand-500/10 text-brand-400 px-3 py-1.5 rounded-full border border-brand-500/20 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {progress.level} Coach Active
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Confidence metric indicator */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Confidence Score</p>
                <p className="text-sm font-extrabold text-brand-400">{progress.confidenceScore}%</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-500/20 flex items-center justify-center p-0.5 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" className="text-white/5" strokeWidth="2.5" fill="transparent" />
                  <circle cx="18" cy="18" r="16" stroke="currentColor" className="text-brand-500" strokeWidth="2.5" fill="transparent"
                    strokeDasharray={100}
                    strokeDashoffset={100 - progress.confidenceScore}
                  />
                </svg>
                <span className="absolute text-[9px] font-extrabold">{progress.confidenceScore}</span>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-500/20 font-bold shadow-md shadow-amber-500/5">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
              <span className="text-sm">{progress.streak} Day Streak</span>
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <main className="flex-1 min-h-0 p-5 z-10 overflow-hidden flex flex-col">
            {currentView === 'dashboard' && (
              <Dashboard 
                progress={progress} 
                navigateToChat={navigateToChat} 
                setCurrentView={setCurrentView}
              />
            )}
            
            {currentView === 'chat' && (
              <AICoach 
                progress={progress} 
                initialMode={chatMode}
                fetchProgress={fetchProgress}
              />
            )}
            
            {currentView === 'writing' && (
              <WritingChecker 
                progress={progress} 
                fetchProgress={fetchProgress}
              />
            )}
            
            {currentView === 'grammar' && (
              <GrammarLessons 
                progress={progress}
                fetchProgress={fetchProgress}
              />
            )}
            
            {currentView === 'challenges' && (
              <DailyChallenges 
                progress={progress} 
                fetchProgress={fetchProgress}
              />
            )}
            
            {currentView === 'vocabulary' && (
              <VocabularyBook />
            )}
        </main>
      </div>
    </div>
  );
}
