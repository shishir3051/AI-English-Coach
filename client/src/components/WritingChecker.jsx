import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Languages,
  ListRestart,
} from 'lucide-react';
import axios from 'axios';
import { WRITING_PROMPTS } from '../data/ieltsFallbacks';

const TASK_TYPES = [
  { id: 'task2', label: 'Task 2 Essay' },
  { id: 'task1_academic', label: 'Task 1 Academic' },
  { id: 'task1_general', label: 'Task 1 Letter' },
  { id: 'general', label: 'General writing' },
];

export default function WritingChecker({ progress, fetchProgress }) {
  const [text, setText] = useState('');
  const [taskType, setTaskType] = useState('task2');
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get('/api/ielts/writing-prompts')
      .then((r) => setPrompts(r.data))
      .catch(() => setPrompts(WRITING_PROMPTS));
  }, []);

  const filteredPrompts = prompts.filter((p) => p.taskType === taskType);

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/coach/analyze-writing', {
        text,
        userId: 'default_user',
        taskType,
      });
      setResult(res.data);
      fetchProgress?.();
    } catch (err) {
      console.warn('Writing analysis failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setSelectedPrompt('');
  };

  const bandRows = result?.bands
    ? [
        ['Task', result.bands.taskAchievement ?? result.bands.taskResponse],
        ['Coherence', result.bands.coherence],
        ['Lexical', result.bands.lexicalResource],
        ['Grammar', result.bands.grammaticalRange],
        ['Overall', result.bands.overall],
      ]
    : [];

  const resultsPanel = result ? (
    <div className="space-y-4 lg:space-y-6">
      {bandRows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          {bandRows.map(([label, val]) => (
            <div key={label} className="text-center p-2 bg-brand-900/60 rounded-xl">
              <span className="text-[9px] text-gray-500 uppercase block">{label}</span>
              <span className="text-lg font-black text-emerald-300">{val ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 rounded-2xl border border-brand-500/25 bg-brand-600/10">
        {[
          { label: 'Overall %', val: result.scores?.overall },
          { label: 'Grammar', val: result.scores?.grammar },
          { label: 'Vocabulary', val: result.scores?.vocabulary },
          { label: 'Coherence', val: result.scores?.coherence },
        ].map((s, i) => (
          <div key={i} className="text-center p-2 bg-brand-900/60 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase block">{s.label}</span>
            <span className="text-lg font-black text-brand-400">{s.val}%</span>
          </div>
        ))}
      </div>

      {result.modelAnswerSnippet && (
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Model improvement</span>
          <p className="text-xs text-brand-300 mt-2 italic">{result.modelAnswerSnippet}</p>
        </div>
      )}

      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div>
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Corrected text</span>
          <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 mt-1">
            {result.correctedText}
          </p>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Native phrasing</span>
          <p className="text-xs text-brand-300 italic mt-1">&ldquo;{result.betterNativeVersion}&rdquo;</p>
        </div>
      </div>

      {result.errors?.length > 0 && (
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">
            Errors ({result.errors.length})
          </span>
          {result.errors.map((err, idx) => (
            <div key={idx} className="p-3 bg-brand-900/50 rounded-xl text-xs">
              <span className="text-rose-400 line-through">{err.original}</span>
              {' → '}
              <span className="text-emerald-400">{err.corrected}</span>
              <p className="text-gray-400 mt-1">{err.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card p-5 rounded-2xl">
        <span className="text-[10px] text-gray-500 font-extrabold uppercase">Structure</span>
        <p className="text-xs text-gray-300 mt-2">{result.structuralAnalysis}</p>
      </div>

      <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 text-emerald-300 text-xs rounded-2xl text-center">
        {result.motivation}
      </div>
    </div>
  ) : (
    <div className="hidden lg:flex glass-card p-6 rounded-2xl flex-col items-center justify-center text-center text-gray-500 gap-3 border-dashed border-white/10 min-h-[240px]">
      <Languages className="w-10 h-10 text-gray-600" />
      <p className="text-xs max-w-sm">Choose a task type, write your answer, and get IELTS band scores.</p>
    </div>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pb-24 lg:pb-2">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-5.5 h-5.5 text-brand-400" /> IELTS Writing Checker
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Official-style band feedback for Task 1 and Task 2.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TASK_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTaskType(t.id); setSelectedPrompt(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              taskType === t.id
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filteredPrompts.map((p) => (
            <button
              key={p._id || p.title}
              type="button"
              onClick={() => { setSelectedPrompt(p.prompt); setText(`${p.prompt}\n\n`); }}
              className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-5 lg:flex-1 lg:min-h-0 gap-4">
        {/* Input — always on top on mobile */}
        <div className="lg:col-span-2 shrink-0">
          <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-2">
              Write / Paste Text
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={selectedPrompt || 'Paste your essay or report here…'}
              className="w-full min-h-[200px] sm:min-h-[220px] lg:min-h-[280px] p-4 bg-brand-900/80 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-white resize-y"
            />
            <p className="text-[10px] text-gray-500 mt-2">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </p>

            {!result && (
              <p className="lg:hidden text-[10px] text-gray-500 mt-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 shrink-0" />
                Tap Check Writing below for IELTS band scores.
              </p>
            )}

            <div className="flex gap-2.5 mt-4 shrink-0">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-sm font-bold rounded-xl"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Check Writing
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl shrink-0"
                aria-label="Reset"
              >
                <ListRestart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results — below input on mobile; side panel on desktop */}
        <div className="lg:col-span-3 lg:overflow-y-auto lg:min-h-0 lg:pr-1">
          {resultsPanel}
        </div>
      </div>
    </div>
  );
}
