import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  Loader2,
  User,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';

export default function AICoach({ progress, initialMode, fetchProgress, loadSessionId }) {
  const [chatModes, setChatModes] = useState([]);
  const [modesLoading, setModesLoading] = useState(true);
  const [mode, setMode] = useState(initialMode || 'Intermediate');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoVoicePlay, setAutoVoicePlay] = useState(true);
  const [activeCorrection, setActiveCorrection] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  // Fetch coach modes from DB on mount
  useEffect(() => {
    const fetchModes = async () => {
      setModesLoading(true);
      try {
        const res = await axios.get('/api/coach-modes');
        setChatModes(res.data);
      } catch (err) {
        console.warn('Could not load coach modes from DB, using fallback.', err.message);
        setChatModes([
          { id: 'Beginner', title: 'Beginner Mode', desc: 'Simple, slow English, clear explanations.', greetingTemplate: 'Hello! I am your AI English Coach. We are in Beginner mode. I will speak very simply. Tell me, how are you today?' },
          { id: 'Intermediate', title: 'Intermediate Mode', desc: 'Standard conversations, common idioms.', greetingTemplate: "Hello! I am your AI English Coach. We are in Intermediate mode. How's your day going? Let's practice talking about something fun!" },
          { id: 'Advanced', title: 'Advanced Mode', desc: 'Sophisticated debates, complex ideas.', greetingTemplate: "Hello! I am your AI English Coach. We are in Advanced mode. How's your day going? Let's practice talking about something fun!" },
          { id: 'IELTS', title: 'IELTS Mode', desc: 'Official IELTS Examiner grading simulation.', greetingTemplate: "Hello! I am your AI English Coach. We are in IELTS mode. Welcome to the IELTS mock speaking assessment. I will act as your examiner. Let's begin Part 1. Can you tell me about your hometown?" },
          { id: 'Kids', title: 'Kids Mode', desc: 'Highly playful, interactive, simple terms.', greetingTemplate: "Hello! I am your AI English Coach. We are in Kids mode. How's your day going? Let's practice talking about something fun!" },
          { id: 'Professional', title: 'Professional Mode', desc: 'Business, interviews, emails, negotiating.', greetingTemplate: "Hello! I am your AI English Coach. We are in Professional mode. Welcome. Let's practice business communications or mock job interview scenarios. Ready to begin?" },
          { id: 'Fast Speaking', title: 'Fast Speaking Mode', desc: 'Quick replies, slangs, connected speech.', greetingTemplate: "Hello! I am your AI English Coach. We are in Fast Speaking mode. Hey! Let's do a fast-paced sprint. Keep your answers quick. Ready?" }
        ]);
      } finally {
        setModesLoading(false);
      }
    };
    fetchModes();
  }, []);

  // Initialize Speech Recognition
useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('Speech Recognition not supported in this browser');
    return;
  }

  const rec = new SpeechRecognition();

  rec.continuous = true; // ✅ IMPORTANT FIX
  rec.interimResults = true; // better UX
  rec.lang = 'en-US';
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    listeningRef.current = true;
    setIsListening(true);
    console.log('Speech recognition active');
  };

  rec.onresult = (event) => {
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalText += transcript + ' ';
      }
    }

    console.log('Speech recognized:', finalText); // Debug log
    // 🔥 DON'T replace input fully every time (prevents stop bug)
    setInput((prev) => (prev + finalText).trim());
  };

  rec.onerror = (e) => {
    console.warn('Speech error:', e.error);
    
    // Show user-friendly error messages
    let errorMsg = 'Speech recognition error: ';
    switch(e.error) {
      case 'network':
        errorMsg += 'Network error. Check your internet connection or try a different browser.';
        break;
      case 'no-speech':
        errorMsg += 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMsg += 'No microphone found. Please check your device.';
        break;
      case 'not-allowed':
        errorMsg += 'Microphone permission denied. Please allow access in browser settings.';
        break;
      default:
        errorMsg += e.error;
    }
    
    console.error(errorMsg);
    alert(errorMsg);
    
    listeningRef.current = false;
    setIsListening(false);
  };

  rec.onend = () => {
    console.log('Speech recognition ended');
    // 🔥 auto-restart if user still wants listening
    if (listeningRef.current) {
      console.log('Restarting speech recognition...');
      try {
        rec.start();
      } catch (e) {
        console.warn('Could not restart:', e);
      }
    } else {
      setIsListening(false);
    }
  };

  recognitionRef.current = rec;
}, []);

  // Start new chat session and set greeting when mode changes
  useEffect(() => {
    if (chatModes.length === 0) return;

    // If loading a previous session, fetch its messages (only if not already loaded)
    if (loadSessionId && sessionId !== loadSessionId) {
      const loadSession = async () => {
        try {
          const res = await axios.get(`/api/sessions/${loadSessionId}`);
          const session = res.data;
          
          // Load all messages from the session
          const loadedMessages = session.messages.map((msg, idx) => ({
            id: `msg-${idx}`,
            role: msg.role,
            content: msg.content,
            correction: msg.correction || null
          }));
          
          setMessages(loadedMessages);
          setSessionId(loadSessionId);
          
          // Show last message as active correction if it has one
          if (loadedMessages.length > 0) {
            const lastMsg = loadedMessages[loadedMessages.length - 1];
            if (lastMsg.correction) {
              setActiveCorrection(lastMsg.correction);
            }
          }
        } catch (err) {
          console.error('Failed to load session:', err);
          startNewSession();
        }
      };
      loadSession();
      return;
    }

    // If we already have this session loaded, don't reload it
    if (sessionId === loadSessionId) {
      return;
    }

    // Otherwise, start a new session
    startNewSession();

    function startNewSession() {
      // Find greeting from DB modes
      const modeData = chatModes.find(m => m.id === mode);
      const greeting = modeData ? modeData.greetingTemplate : `Hello! I am your AI English Coach. We are in ${mode} mode. Let's practice!`;

      const greetingMsg = {
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        correction: null
      };

      setMessages([greetingMsg]);
      setActiveCorrection(null);

      if (autoVoicePlay) handleSpeak(greeting);

      // Create a new persistent session in DB
      const createSessionAsync = async () => {
        try {
          const res = await axios.post('/api/sessions', { userId: 'default_user', mode });
          const newSessionId = res.data._id;
          setSessionId(newSessionId);

          // Save greeting message to DB session
          await axios.post(`/api/sessions/${newSessionId}/messages`, {
            role: 'assistant',
            content: greeting
          });
        } catch (err) {
          console.warn('Could not create DB session, continuing in-memory.', err.message);
        }
      };
      createSessionAsync();
    }
  }, [mode, chatModes, loadSessionId, sessionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = mode === 'Beginner' ? 0.8 : (mode === 'Fast Speaking' ? 1.05 : 0.95);
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

const toggleListening = () => {
  const rec = recognitionRef.current;

  if (!rec) {
    console.error('Speech recognition not supported');
    alert("Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.");
    return;
  }

  if (listeningRef.current) {
    console.log('Stopping speech recognition');
    rec.stop();
    listeningRef.current = false;
    setIsListening(false);
  } else {
    console.log('Starting speech recognition');
    window.speechSynthesis.cancel();

    try {
      rec.start();
      listeningRef.current = true;
      setIsListening(true);
      console.log('✅ Mic is now listening...');
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      alert(`Mic error: ${e.message || e}. Make sure microphone permission is enabled.`);
      listeningRef.current = false;
      setIsListening(false);
    }
  }
};

 const handleSend = async (e) => {
  e?.preventDefault();

  if (!input.trim() || loading) return;

  const userMessageText = input.trim();

  setInput('');
  setLoading(true);
  setActiveCorrection(null);

  const userMsg = {
    id: Date.now().toString(),
    role: 'user',
    content: userMessageText
  };

  const updatedMessages = [
    ...messages,
    userMsg
  ];

  setMessages(updatedMessages);

  try {

    const chatHistory =
      updatedMessages
        .filter(
          m =>
            m.role &&
            m.id !== 'greeting'
        )
        .slice(-6)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

    console.log(
      '📤 Sending to API:',
      {
        message:
          userMessageText,
        mode,
        sessionId,
        historyLength:
          chatHistory.length
      }
    );

    const res =
      await axios.post(
        '/api/coach/chat',
        {
          message:
            userMessageText,

          history:
            chatHistory,

          mode,

          userId:
            'default_user',

          sessionId
        },
        {
          timeout: 60000
        }
      );

    const data =
      res.data;

    console.log(
      '📥 API:',
      data
    );

    const coachMsg = {
      id:
        (
          Date.now() + 1
        ).toString(),

      role:
        'assistant',

      content:
        data.reply ||
        'No response',

      correction:
        data.correction ||
        null
    };

    setMessages(
      prev => [
        ...prev,
        coachMsg
      ]
    );

    setActiveCorrection(
      data.correction ||
      null
    );

    if (
      data.sessionId &&
      data.sessionId !==
      sessionId
    ) {
      setSessionId(
        data.sessionId
      );
    }

    if (
      autoVoicePlay &&
      data.reply
    ) {
      handleSpeak(
        data.reply
      );
    }

    if (
      fetchProgress
    ) {
      fetchProgress();
    }

  } catch (err) {

    console.error(
      '❌ Chat API Error:',
      err.response?.data ||
      err.message
    );

    const fallbackMsg = {
      id:
        Date.now()
          .toString(),

      role:
        'assistant',

      content:
        "Sorry, I'm having trouble responding right now. Please try again.",

      correction:
        null
    };

    setMessages(
      prev => [
        ...prev,
        fallbackMsg
      ]
    );

    setActiveCorrection(
      null
    );

  } finally {

    setLoading(
      false
    );
  }
};

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-5 w-full overflow-y-auto lg:overflow-visible pr-1 pb-24 lg:pb-0">
      
      {/* Left Column: Modes from DB */}
      <div className="order-2 lg:order-1 lg:col-span-1 min-w-0 flex flex-col gap-3 overflow-visible lg:overflow-hidden">
        <h3 className="text-xs font-extrabold uppercase text-gray-500 tracking-wider shrink-0">Coach Mode</h3>
        <div className="space-y-2 overflow-visible lg:overflow-y-auto lg:flex-1 lg:min-h-0 pr-1">
          {modesLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-14 bg-brand-850/40 rounded-2xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            chatModes.map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setActiveCorrection(null); }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1 ${
                  mode === m.id
                    ? 'bg-gradient-to-tr from-brand-600/30 to-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/5'
                    : 'bg-brand-850/40 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-extrabold tracking-wide text-white">{m.title}</span>
                <span className="text-[10px] text-gray-400 leading-snug">{m.desc}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Center Column: Chat */}
      <div className="order-1 lg:order-2 lg:col-span-2 min-w-0 h-[calc(100dvh-11rem)] min-h-[420px] lg:h-auto lg:min-h-0 flex flex-col bg-brand-850/20 rounded-3xl border border-white/5 overflow-hidden">
        {/* Chat Header */}
        <div className="shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-brand-850/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">{mode} Training Session</span>
          </div>
          
          <button 
            onClick={() => setAutoVoicePlay(!autoVoicePlay)}
            className={`p-2 rounded-xl transition-all ${
              autoVoicePlay 
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                : 'text-gray-500 hover:bg-white/5'
            }`}
            title="Auto Audio Playback"
          >
            {autoVoicePlay ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Messages Stream */}
        <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={m.id || idx} 
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border ${
                m.role === 'user' 
                  ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                {m.role === 'user' ? <User className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-brand-600 text-white font-medium rounded-tr-none' 
                    : 'bg-brand-850/60 text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
                
                {m.correction && (
                  <button 
                    onClick={() => setActiveCorrection(m.correction)}
                    className="flex items-center gap-1 text-[10px] text-brand-400 font-extrabold uppercase hover:underline ml-2 bg-brand-500/10 px-2 py-0.5 rounded"
                  >
                    <AlertCircle className="w-3 h-3" /> View Real-time feedback
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border bg-white/5 border-white/10 text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-brand-850/60 border border-white/5 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                <span className="text-xs text-gray-400">Coach is thinking...</span>
              </div>
            </div>
          )}

          {/* Scroll sentinel */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="shrink-0 p-3 sm:p-4 border-t border-white/5 bg-brand-850/40 flex items-center gap-2">
          <button 
            type="button"
            onClick={toggleListening}
            className={`p-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 ${
              isListening 
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30' 
                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
            }`}
            title="Speech to Text"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Message coach or say 'Teach Grammar'..."}
            disabled={loading}
            className="min-w-0 flex-1 px-4 py-3 text-sm bg-brand-900 border border-white/10 rounded-2xl focus:border-brand-500 focus:outline-none text-white disabled:opacity-50"
          />

          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white rounded-2xl transition-all shadow-md shadow-brand-600/10 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Right Column: Corrections */}
      <div className="order-3 lg:order-3 lg:col-span-1 min-w-0 flex flex-col gap-3 overflow-visible lg:overflow-hidden">
        <h3 className="text-xs font-extrabold uppercase text-gray-500 tracking-wider shrink-0">Mistakes &amp; Diagnostics</h3>
        
        {activeCorrection ? (
          <div className="glass-card p-5 rounded-3xl space-y-4 border-brand-500/20 relative animate-fadeIn flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-extrabold text-brand-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Grammatical Check
              </span>
              <div className="bg-brand-500/20 text-brand-300 px-2.5 py-1 rounded-xl text-xs font-bold font-mono">
                Score: {activeCorrection.confidenceScore}/100
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase">Original Input</span>
                <p className="text-xs text-rose-300 line-through bg-rose-500/5 px-2.5 py-1.5 rounded-lg border border-rose-500/10 mt-1">{activeCorrection.original}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase">Corrected Form</span>
                <p className="text-xs text-emerald-300 font-semibold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10 mt-1">{activeCorrection.corrected}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase">Analysis Explanation</span>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">{activeCorrection.explanation}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase">Natural Native Phrasing</span>
                <p className="text-xs text-brand-300 font-medium italic mt-1">&ldquo;{activeCorrection.betterNative}&rdquo;</p>
              </div>

              {activeCorrection.pronunciationTips && (
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Pronunciation Guidance</span>
                  <p className="text-xs text-violet-300 mt-1 font-mono">{activeCorrection.pronunciationTips}</p>
                </div>
              )}

              {activeCorrection.vocabularyUpgrade && (
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Lexical Upgrade</span>
                  <div className="p-2.5 bg-brand-500/10 text-xs font-bold text-gray-200 border border-brand-500/20 rounded-xl mt-1">
                    {activeCorrection.vocabularyUpgrade}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-300 text-[11px] font-semibold rounded-xl text-center leading-relaxed">
              💡 {activeCorrection.motivation}
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center text-gray-500 gap-3 border-dashed border-white/10 flex-1 min-h-0">
            <HelpCircle className="w-8 h-8 text-gray-600" />
            <p className="text-xs leading-relaxed max-w-xs font-medium">
              No errors detected yet. Start chatting or speak below, and corrections will populate here instantly.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
