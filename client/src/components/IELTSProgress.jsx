import React, { useState, useEffect } from 'react';
import {
  Target,
  Mic,
  FileText,
  Headphones,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { checkApiFeatures, hasIeltsApi } from '../utils/apiHealth';
import { DEFAULT_IELTS_PROGRESS } from '../data/ieltsFallbacks';
import BackendStaleBanner from './BackendStaleBanner';

const SKILLS = [
  { key: 'listening', label: 'Listening', icon: Headphones, color: 'text-cyan-400' },
  { key: 'reading', label: 'Reading', icon: BookOpen, color: 'text-emerald-400' },
  { key: 'writing', label: 'Writing', icon: FileText, color: 'text-violet-400' },
  { key: 'speaking', label: 'Speaking', icon: Mic, color: 'text-rose-400' },
];

export default function IELTSProgress({
  progress,
  fetchProgress,
  navigateToChat,
  setCurrentView,
}) {
  const [ielts, setIelts] = useState(progress?.ielts || null);
  const [loading, setLoading] = useState(true);
  const [targetInput, setTargetInput] = useState('6.5');
  const [apiStale, setApiStale] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const health = await checkApiFeatures();
      const ieltsApiOk = hasIeltsApi(health.features);
      setApiStale(health.ok && !ieltsApiOk);

      try {
        const res = await axios.get('/api/progress/ielts?userId=default_user');
        setIelts(res.data);
        setTargetInput(String(res.data.targetBand || 6.5));
        setApiStale(false);
      } catch {
        setIelts(progress?.ielts || DEFAULT_IELTS_PROGRESS);
        setTargetInput(String(progress?.ielts?.targetBand || DEFAULT_IELTS_PROGRESS.targetBand));
        if (!ieltsApiOk) setApiStale(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [progress?.ielts]);

  const saveTarget = async () => {
    try {
      await axios.put('/api/progress/ielts/target', {
        targetBand: Number(targetInput),
        userId: 'default_user',
      });
      fetchProgress?.();
      const res = await axios.get('/api/progress/ielts?userId=default_user');
      setIelts(res.data);
    } catch (e) {
      console.warn('Could not save target band', e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  const skills = ielts?.skills || {};
  const attempts = ielts?.attempts || [];

  return (
    <div className="flex-1 min-h-0 space-y-5 overflow-y-auto pr-1 pb-24 lg:pb-2">
      {apiStale && <BackendStaleBanner />}
      <div className="glass-card p-6 rounded-3xl border-brand-500/20">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-brand-400" />
          IELTS Progress Hub
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          Track your estimated bands across all four skills. Complete mocks to update scores.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">Target band</label>
            <input
              type="number"
              step="0.5"
              min="4"
              max="9"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="mt-1 w-24 px-3 py-2 bg-brand-900 border border-white/10 rounded-xl text-white text-sm"
            />
          </div>
          <button
            type="button"
            onClick={saveTarget}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl"
          >
            Save target
          </button>
          <div className="ml-auto text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Overall estimate</span>
            <span className="text-3xl font-black text-brand-400">
              {ielts?.overallBand > 0 ? ielts.overallBand : '—'}
            </span>
            <span className="text-xs text-gray-500"> / {ielts?.targetBand || 6.5} goal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILLS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="glass-card p-4 rounded-2xl">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <span className="text-[10px] text-gray-500 font-bold uppercase">{label}</span>
            <p className={`text-2xl font-black mt-1 ${color}`}>
              {skills[key]?.band > 0 ? skills[key].band : '—'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Speaking mock', view: 'chat', mode: 'IELTS', desc: 'Parts 1–3 examiner simulation' },
          { label: 'Writing practice', view: 'writing', desc: 'Task 1 & Task 2 with band feedback' },
          { label: 'Listening test', view: 'ielts_listen', desc: 'Practice listening with band score' },
          { label: 'Reading test', view: 'ielts_read', desc: 'Academic-style reading practice' },
        ].map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => {
              if (item.mode) navigateToChat(item.mode);
              else setCurrentView(item.view);
            }}
            className="glass-card glass-card-hover p-4 rounded-2xl text-left flex items-center justify-between group"
          >
            <div>
              <h4 className="font-bold text-white">{item.label}</h4>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>
        ))}
      </div>

      {attempts.length > 0 && (
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-extrabold uppercase text-gray-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Recent attempts
          </h3>
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {attempts.map((a, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-brand-900/50 rounded-xl border border-white/5 text-xs"
              >
                <span className="font-bold text-white capitalize">
                  {a.skill} · {a.taskType}
                </span>
                <span className="text-brand-400 font-black">
                  Band {a.bands?.overall ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
