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
  const [activeIeltsBands, setActiveIeltsBands] = useState(null);
  const [ieltsSpeakingPart, setIeltsSpeakingPart] = useState(null);
  const [ieltsSession, setIeltsSession] = useState(null);
  const [prepSeconds, setPrepSeconds] = useState(null);
  const [speakSeconds, setSpeakSeconds] = useState(null);
  const [mockReport, setMockReport] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [speechError, setSpeechError] = useState(null);
  const [useServerStt, setUseServerStt] = useState(false);

  useEffect(() => {
    useServerSttRef.current = useServerStt;
  }, [useServerStt]);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const lastSpeechErrorRef = useRef(null);
  const useServerSttRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechBaseRef = useRef('');
  const sessionInitKeyRef = useRef(null);
  const browserSttBlockedRef = useRef(false);

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

  const stopAudioStream = () => {
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioStreamRef.current = null;
  };

  const stopListening = () => {
    listeningRef.current = false;
    setIsListening(false);
    try {
      recognitionRef.current?.abort();
    } catch {
      /* already stopped */
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    stopAudioStream();
  };

  // Detect stale backend missing GET /api/coach/transcribe (no empty POST probe)
  useEffect(() => {
    let cancelled = false;
    axios.get('/api/coach/transcribe').catch((err) => {
      if (cancelled || err.response?.status !== 404) return;
      useServerSttRef.current = true;
      setUseServerStt(true);
      setSpeechError(
        'Voice transcription needs a backend restart. Stop the server on port 5000, then run: cd server && npm start'
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const transcribeRecordedAudio = async (blob, mimeType) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl !== 'string') {
          reject(new Error('Could not read audio'));
          return;
        }
        resolve(dataUrl.split(',')[1]);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    const res = await axios.post('/api/coach/transcribe', { audio: base64, mimeType });
    const text = res.data?.text?.trim();
    if (text) {
      setInput((prev) => (prev ? `${prev} ${text}` : text).trim());
      setSpeechError(null);
    }
  };

  const stopServerRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'recording') {
      listeningRef.current = false;
      setIsListening(false);
      stopAudioStream();
      return;
    }

    listeningRef.current = false;
    setIsListening(false);

    await new Promise((resolve) => {
      recorder.onstop = resolve;
      recorder.stop();
    });

    stopAudioStream();
    mediaRecorderRef.current = null;

    const mimeType = recorder.mimeType || 'audio/webm';
    const blob = new Blob(audioChunksRef.current, { type: mimeType });
    audioChunksRef.current = [];

    if (blob.size < 800) {
      setSpeechError('Recording too short. Hold the mic longer and speak clearly.');
      return;
    }

    try {
      setSpeechError('Transcribing…');
      await transcribeRecordedAudio(blob, mimeType);
      setSpeechError(null);
    } catch (err) {
      console.error('Server transcription failed:', err);
      if (err.response?.status === 404) {
        setSpeechError(
          'Transcribe API not found — restart the backend: stop port 5000, then run `cd server && npm start`.'
        );
        return;
      }
      setSpeechError(
        err.response?.data?.error ||
          'Server transcription failed. Check GEMINI_API_KEY and your connection.'
      );
    }
  };

  const startServerRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setSpeechError('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      listeningRef.current = true;
      setIsListening(true);
      setSpeechError(null);
    } catch (err) {
      console.error('Could not start microphone:', err);
      setSpeechError('Microphone access denied or unavailable.');
      listeningRef.current = false;
      setIsListening(false);
      stopAudioStream();
    }
  };

  // Initialize browser Speech Recognition (Chrome/Edge only; uses Google cloud)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      useServerSttRef.current = true;
      setUseServerStt(true);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      lastSpeechErrorRef.current = null;
      listeningRef.current = true;
      setIsListening(true);
      setSpeechError(null);
    };

    rec.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }

      const base = speechBaseRef.current;
      if (finalText) {
        const merged = `${base} ${finalText}`.trim();
        speechBaseRef.current = merged;
        setInput(merged);
      } else if (interimText) {
        setInput(`${base} ${interimText}`.trim());
      }
    };

    rec.onerror = (e) => {
      console.warn('Speech error:', e.error);
      lastSpeechErrorRef.current = e.error;
      listeningRef.current = false;
      setIsListening(false);

      if (e.error === 'no-speech') {
        setSpeechError('No speech heard. Try again.');
        return;
      }

      if (e.error === 'network') {
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
        browserSttBlockedRef.current = true;
        useServerSttRef.current = true;
        setUseServerStt(true);
        setSpeechError(
          'Browser speech unavailable. Tap mic → speak → tap mic again (server transcription).'
        );
        return;
      }

      const messages = {
        'audio-capture': 'No microphone found. Check your device.',
        'not-allowed': 'Microphone blocked. Allow mic access for this site in browser settings.',
        aborted: 'Listening stopped.',
      };
      setSpeechError(messages[e.error] || `Speech error: ${e.error}`);
    };

    rec.onend = () => {
      if (!listeningRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;

    return () => {
      listeningRef.current = false;
      setIsListening(false);
      try {
        rec.abort();
      } catch {
        /* already stopped */
      }
      stopAudioStream();
      if (mediaRecorderRef.current?.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          /* ignore */
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Start new chat session when mode changes or a history session is opened (once per key)
  useEffect(() => {
    if (chatModes.length === 0) return;

    const initKey = loadSessionId ? `load:${loadSessionId}` : `new:${mode}`;
    if (sessionInitKeyRef.current === initKey) return;
    sessionInitKeyRef.current = initKey;

    if (loadSessionId) {
      const loadSession = async () => {
        try {
          const res = await axios.get(`/api/sessions/${loadSessionId}`);
          const session = res.data;

          const loadedMessages = session.messages.map((msg, idx) => ({
            id: `msg-${idx}`,
            role: msg.role,
            content: msg.content,
            correction: msg.correction || null
          }));

          setMessages(loadedMessages);
          setSessionId(loadSessionId);

          if (loadedMessages.length > 0) {
            const lastMsg = loadedMessages[loadedMessages.length - 1];
            if (lastMsg.correction) {
              setActiveCorrection(lastMsg.correction);
            }
          }
        } catch (err) {
          console.error('Failed to load session:', err);
          sessionInitKeyRef.current = `new:${mode}`;
          startNewSession();
        }
      };
      loadSession();
      return;
    }

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
      setSessionId(null);

      if (autoVoicePlay) handleSpeak(greeting);
      // Session is created in the DB only after the user sends their first message (via /api/coach/chat).
    }
  }, [mode, chatModes, loadSessionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (prepSeconds === null || prepSeconds <= 0) return;
    const t = setInterval(() => {
      setPrepSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [prepSeconds]);

  useEffect(() => {
    if (speakSeconds === null || speakSeconds <= 0) return;
    const t = setInterval(() => {
      setSpeakSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [speakSeconds]);

  const handleSpeak = (text) => {
    stopListening();
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

  const toggleListening = async () => {
    window.speechSynthesis.cancel();

    if (listeningRef.current) {
      if (useServerStt) {
        await stopServerRecording();
      } else {
        recognitionRef.current?.stop();
        listeningRef.current = false;
        setIsListening(false);
      }
      return;
    }

    if (useServerStt || browserSttBlockedRef.current || !recognitionRef.current) {
      await startServerRecording();
      return;
    }

    speechBaseRef.current = input;

    try {
      recognitionRef.current.start();
      setSpeechError(null);
    } catch (e) {
      console.warn('Browser STT unavailable, using server fallback:', e);
      useServerSttRef.current = true;
      setUseServerStt(true);
      await startServerRecording();
    }
  };

 const handleSend = async (e, overrideMessage) => {
  e?.preventDefault();

  const userMessageText = (overrideMessage ?? input).trim();
  if (!userMessageText || loading) return;

  stopListening();
  window.speechSynthesis.cancel();

  setInput('');
  speechBaseRef.current = '';
  setLoading(true);
    setActiveCorrection(null);
    setMockReport(null);

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

          sessionId,
          ieltsAction: mode === 'IELTS' && userMessageText.toLowerCase().includes('finish mock')
            ? 'finish_mock'
            : undefined,
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

    setActiveCorrection(data.correction || null);
    setActiveIeltsBands(data.bands || null);
    setIeltsSpeakingPart(data.speakingPart ?? data.ieltsMock?.currentPart ?? null);
    if (data.ieltsMock) setIeltsSession(data.ieltsMock);
    if (userMessageText.toLowerCase().includes('finish mock') && data.bands) {
      setMockReport(data.bands);
    }

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

    setActiveCorrection(null);
    setActiveIeltsBands(null);

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
        <div className="shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-brand-850/40 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">{mode} Training Session</span>
            {mode === 'IELTS' && ieltsSpeakingPart && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Part {ieltsSpeakingPart}
              </span>
            )}
          </div>
          {mode === 'IELTS' && (
            <div className="flex flex-wrap gap-1.5">
              {ieltsSpeakingPart === 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPrepSeconds(60)}
                    className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20"
                  >
                    Prep {prepSeconds != null ? `${prepSeconds}s` : '1:00'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPrepSeconds(null); setSpeakSeconds(120); }}
                    className="text-[10px] font-bold text-violet-300 bg-violet-500/10 px-2 py-1 rounded-lg border border-violet-500/20"
                  >
                    Speak {speakSeconds != null ? `${speakSeconds}s` : '2:00'}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleSend({ preventDefault: () => {} }, 'finish mock')}
                className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                End mock
              </button>
            </div>
          )}
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

        {speechError && (
          <p className="shrink-0 px-4 py-2 text-xs text-amber-300 bg-amber-500/10 border-t border-amber-500/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{speechError}</span>
          </p>
        )}

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
            placeholder={
              isListening
                ? useServerStt
                  ? 'Recording… tap mic when done'
                  : 'Listening…'
                : "Message coach or say 'Teach Grammar'..."
            }
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
        
        {mode === 'IELTS' && ieltsSession?.cueCard && (
          <div className="glass-card p-3 rounded-2xl border-cyan-500/20 shrink-0 text-xs text-gray-300">
            <span className="text-[10px] font-extrabold uppercase text-cyan-400">Cue card</span>
            <p className="mt-1">{ieltsSession.cueCard}</p>
          </div>
        )}

        {mode === 'IELTS' && mockReport && (
          <div className="glass-card p-4 rounded-2xl border-amber-500/30 shrink-0">
            <span className="text-[10px] font-extrabold uppercase text-amber-300">Mock complete — final bands</span>
            <p className="text-center mt-2 text-lg font-black text-white">Overall {mockReport.overall ?? '—'}</p>
          </div>
        )}

        {mode === 'IELTS' && activeIeltsBands && (
          <div className="glass-card p-4 rounded-2xl border-emerald-500/20 shrink-0">
            <span className="text-[10px] font-extrabold uppercase text-emerald-400">IELTS Speaking bands</span>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {[
                ['Fluency', activeIeltsBands.fluency],
                ['Lexical', activeIeltsBands.lexical],
                ['Grammar', activeIeltsBands.grammar],
                ['Pronunciation', activeIeltsBands.pronunciation],
              ].map(([label, val]) => (
                <div key={label} className="bg-brand-900/60 p-2 rounded-lg text-center">
                  <span className="text-gray-500 block text-[9px]">{label}</span>
                  <span className="font-black text-emerald-300">{val ?? '—'}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-2 text-sm font-black text-white">
              Overall: <span className="text-brand-400">{activeIeltsBands.overall ?? '—'}</span>
            </p>
          </div>
        )}

        {activeCorrection ? (
          <div className="glass-card p-5 rounded-3xl space-y-4 border-brand-500/20 relative animate-fadeIn flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-extrabold text-brand-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {mode === 'IELTS' ? 'Feedback' : 'Grammatical Check'}
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
