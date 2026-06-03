import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import {
  READING_TESTS,
  READING_TEST_DETAILS,
  scoreReadingLocally,
} from '../data/ieltsFallbacks';
import BackendStaleBanner from './BackendStaleBanner';

export default function IELTSReading({ onBack, fetchProgress }) {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiStale, setApiStale] = useState(false);

  useEffect(() => {
    axios
      .get('/api/ielts/reading')
      .then((r) => {
        setTests(r.data);
        setApiStale(false);
      })
      .catch(() => {
        setTests(READING_TESTS);
        setApiStale(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadTest = async (testId) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await axios.get(`/api/ielts/reading/${testId}`);
      setActiveTest(res.data);
      setApiStale(false);
    } catch {
      const fallback = READING_TEST_DETAILS[testId];
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
      const res = await axios.post(`/api/ielts/reading/${activeTest.testId}/submit`, {
        answers,
        userId: 'default_user',
      });
      setResult(res.data);
      fetchProgress?.();
    } catch {
      setResult(scoreReadingLocally(activeTest.testId, answers));
    } finally {
      setSubmitting(false);
    }
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
          <BookOpen className="w-6 h-6 text-emerald-400" /> IELTS Reading
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
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" /> All tests
      </button>

      {apiStale && <BackendStaleBanner />}

      <h3 className="font-bold text-white">{activeTest.title}</h3>

      {activeTest.passages?.map((p, i) => (
        <div key={i} className="glass-card p-4 rounded-2xl">
          <h4 className="text-xs font-bold text-brand-400 uppercase mb-2">{p.title}</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{p.body}</p>
        </div>
      ))}

      {!result ? (
        <div className="space-y-3">
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
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit answers'}
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-black">Band {result.band} · {result.correct}/{result.total}</p>
        </div>
      )}
    </div>
  );
}
