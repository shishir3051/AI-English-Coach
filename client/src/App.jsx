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
  Headphones,
  PenLine,
  Volume2,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import axios from 'axios';

// Component Imports
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import WritingChecker from './components/WritingChecker';
import GrammarLessons from './components/GrammarLessons';
import DailyChallenges from './components/DailyChallenges';
import VocabularyBook from './components/VocabularyBook';
import ChatHistoryPage from './components/ChatHistoryPage';
import IELTSProgress from './components/IELTSProgress';
import IELTSListening from './components/IELTSListening';
import IELTSReading from './components/IELTSReading';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  // Start closed on mobile; CSS keeps sidebar visible on lg+ regardless
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [loadSessionId, setLoadSessionId] = useState(null);

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

  const stopCoachAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const navigateToChat = (mode) => {
    if (currentView === 'chat') stopCoachAudio();
    setLoadSessionId(null);
    setChatMode(mode);
    setCurrentView('chat');
    setSidebarOpen(false);
  };

  const handleLoadSession = (sessionId, mode) => {
    stopCoachAudio();
    setLoadSessionId(sessionId);
    setChatMode(mode);
    setCurrentView('chat');
    setSidebarOpen(false);
  };

  const navigate = (view) => {
    if (currentView === 'chat') stopCoachAudio();
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-brand-900 text-gray-100 flex relative overflow-hidden font-sans">
      {/* Background glow filters */}
      <div className="glow-mesh glow-violet"></div>
      <div className="glow-mesh glow-indigo"></div>

      {/* Mobile overlay backdrop — tap outside to close sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            {[
              { view: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', action: () => navigate('dashboard') },
              { view: 'ielts', icon: <Target className="w-5 h-5" />, label: 'IELTS Progress', action: () => navigate('ielts') },
              { view: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'AI Coach Chat', action: () => navigateToChat('Intermediate') },
              { view: 'history', icon: <Clock className="w-5 h-5" />, label: 'Chat History', action: () => navigate('history') },
              { view: 'writing', icon: <FileText className="w-5 h-5" />, label: 'Writing Checker', action: () => navigate('writing') },
              { view: 'grammar', icon: <BookOpen className="w-5 h-5" />, label: 'Grammar A to Z', action: () => navigate('grammar') },
              { view: 'challenges', icon: <Trophy className="w-5 h-5" />, label: 'Daily Challenges', action: () => navigate('challenges') },
              { view: 'vocabulary', icon: <BookOpen className="w-5 h-5" />, label: 'Vocabulary Bank', action: () => navigate('vocabulary') },
            ].map(({ view, icon, label, action }) => (
              <button
                key={view}
                onClick={action}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentView === view
                    ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 border border-brand-500/30 text-white shadow-md shadow-brand-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all" aria-label="Open menu">
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
        {/* pb-16 on mobile adds space above the bottom nav bar */}
        <main className="flex-1 min-h-0 p-3 sm:p-5 pb-24 lg:pb-5 z-10 overflow-y-auto flex flex-col">
            {currentView === 'dashboard' && (
              <Dashboard 
                progress={progress} 
                navigateToChat={navigateToChat} 
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === 'ielts' && (
              <IELTSProgress
                progress={progress}
                fetchProgress={fetchProgress}
                navigateToChat={navigateToChat}
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === 'ielts_listen' && (
              <IELTSListening onBack={() => navigate('ielts')} fetchProgress={fetchProgress} />
            )}

            {currentView === 'ielts_read' && (
              <IELTSReading onBack={() => navigate('ielts')} fetchProgress={fetchProgress} />
            )}
            
            {currentView === 'chat' && (
              <AICoach 
                progress={progress} 
                initialMode={chatMode}
                fetchProgress={fetchProgress}
                loadSessionId={loadSessionId}
              />
            )}

            {currentView === 'history' && (
              <ChatHistoryPage 
                onLoadSession={handleLoadSession}
                onBack={() => navigate('dashboard')}
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

        {/* ── Mobile Bottom Navigation Bar (hidden on lg+) ─────────────── */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-brand-900/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-1 py-2 safe-area-inset-bottom">
          {[
            { view: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home', action: () => navigate('dashboard') },
            { view: 'ielts', icon: <Target className="w-5 h-5" />, label: 'IELTS', action: () => navigate('ielts') },
            { view: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Coach', action: () => navigateToChat('Intermediate') },
            { view: 'writing', icon: <PenLine className="w-5 h-5" />, label: 'Write', action: () => navigate('writing') },
            { view: 'grammar', icon: <BookOpen className="w-5 h-5" />, label: 'Grammar', action: () => navigate('grammar') },
          ].map(({ view, icon, label, action }) => (
            <button
              key={view}
              onClick={action}
              className={`flex flex-col items-center gap-0.5 min-w-0 flex-1 px-1 py-1.5 rounded-xl transition-all ${
                currentView === view || (view === 'ielts' && (currentView === 'ielts_listen' || currentView === 'ielts_read'))
                  ? 'text-brand-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {icon}
              <span className="text-[8px] font-bold tracking-wide truncate w-full text-center">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
