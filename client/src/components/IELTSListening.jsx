import React, { useState, useEffect } from 'react';
import { Headphones, ChevronLeft, CheckCircle, Loader2, Volume2 } from 'lucide-react';
import axios from 'axios';
import {
  LISTENING_TESTS,
  LISTENING_TEST_DETAILS,
  scoreListeningLocally,
} from '../data/ieltsFallbacks';
import BackendStaleBanner from './BackendStaleBanner';

export default function IELTSListening({ onBack, fetchProgress }) {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiStale, setApiStale] = useState(false);

  useEffect(() => {
    axios
      .get('/api/ielts/listening')
      .then((r) => {
        setTests(r.data);
        setApiStale(false);
      })
      .catch(() => {
        setTests(LISTENING_TESTS);
        setApiStale(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadTest = async (testId) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await axios.get(`/api/ielts/listening/${testId}`);
      setActiveTest(res.data);
      setApiStale(false);
    } catch {
      const fallback = LISTENING_TEST_DETAILS[testId];
      if (!fallback) {
        setApiStale(true);
        setLoading(false);
        return;
      }
      setActiveTest(fallback);
      setApiStale(true);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/ielts/listening/${activeTest.testId}/submit`, {
        answers,
        userId: 'default_user',
      });
      setResult(res.data);
      fetchProgress?.();
    } catch {
      const local = scoreListeningLocally(activeTest.testId, answers);
      setResult(local);
    } finally {
      setSubmitting(false);
    }
  };

  const speakTranscript = () => {
    if (!activeTest?.transcript || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(activeTest.transcript);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  if (loading && !activeTest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!activeTest) {
    return (
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pb-24 lg:pb-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Headphones className="w-6 h-6 text-cyan-400" /> IELTS Listening
        </h2>
        {apiStale && <BackendStaleBanner />}
        <div className="grid gap-3">
          {tests.map((t) => (
            <button
              key={t.testId}
              type="button"
              onClick={() => loadTest(t.testId)}
              className="glass-card glass-card-hover p-4 rounded-2xl text-left"
            >
              <h4 className="font-bold text-white">{t.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{t.questionCount} questions</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pb-24 lg:pb-2">
      <button
        type="button"
        onClick={() => { setActiveTest(null); setResult(null); }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white shrink-0"
      >
        <ChevronLeft className="w-4 h-4" /> All tests
      </button>

      <div className="glass-card p-4 rounded-2xl shrink-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-white">{activeTest.title}</h3>
          <button type="button" onClick={speakTranscript} className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400" title="Play audio (TTS)">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">{activeTest.transcript}</p>
      </div>

      {!result ? (
        <div className="space-y-3 flex-1">
          {activeTest.questions.map((q) => (
            <div key={q.id} className="glass-card p-4 rounded-2xl">
              <p className="text-sm font-medium text-white mb-2">{q.id}. {q.question}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    />
                    <span className="text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit answers'}
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-2xl font-black text-white">
            Band {result.band} · {result.correct}/{result.total}
          </p>
          <p className="text-xs text-gray-400">Saved to your IELTS progress</p>
        </div>
      )}
    </div>
  );
}
