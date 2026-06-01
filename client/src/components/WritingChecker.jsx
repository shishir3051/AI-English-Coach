import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Languages, 
  Volume2,
  ListRestart
} from 'lucide-react';
import axios from 'axios';

export default function WritingChecker({ progress, fetchProgress }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/coach/analyze-writing', {
        text,
        userId: 'default_user'
      });
      setResult(res.data);
      fetchProgress(); // update general statistics
    } catch (err) {
      console.warn('Backend not running. Triggering mock essay checker analysis.', err.message);
      // Mock Fallback Writing Analysis
      setTimeout(() => {
        setResult({
          correctedText: text.replace(/i am go/g, 'I am going').replace(/every day/g, 'everyday'),
          errors: [
            { original: 'i am go', corrected: 'I am going', type: 'grammar', explanation: "Subject-Verb tense mismatch. 'I am' must be followed by a gerund 'going' for continuous tense, or basic present simple 'I go'." },
            { original: 'every day', corrected: 'everyday', type: 'spelling', explanation: "Use 'everyday' as an adjective (e.g., everyday routines). Use two words 'every day' as an adverbial phrase." }
          ],
          structuralAnalysis: "The sentences are structured too simply. Try joining thoughts using coordinating conjunctions like 'and', 'but', or 'so' to increase syntax variety.",
          betterNativeVersion: "I am writing to express my interest in joining your dynamic team. Daily, I strive to improve my communication and technical competencies.",
          vocabularyUpgrades: [
            { originalWord: 'go', upgrade: 'proceed', meaning: 'Move forward or carry out a action.', example: 'Let us proceed with the discussion.' },
            { originalWord: 'improve', upgrade: 'cultivate', meaning: 'Try to acquire or develop a quality or skill.', example: 'She seeks to cultivate her leadership abilities.' }
          ],
          scores: {
            grammar: 75,
            vocabulary: 80,
            coherence: 85,
            overall: 80
          },
          motivation: "Good work writing this draft! Reviewing your errors is the fastest path to clarity. Apply the upgrades and try editing it again."
        });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  const handleSpeak = (speechText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-brand-400" /> Writing Checker & Reviewer
          </h2>
          <p className="text-xs text-gray-500">Paste your essays, IELTS paragraphs, or work drafts for absolute syntax evaluation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 flex-1 min-h-0">
        
        {/* Input box: spans 2 cols */}
        <div className="lg:col-span-2 h-full flex flex-col gap-4 min-h-0">
          <div className="glass-card p-5 rounded-2xl flex flex-col flex-1 min-h-0">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-2">Write / Paste Text</span>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: I am go to office every day for complete my works. It make me happy but some days I gets very tired."
              className="flex-1 w-full p-4 bg-brand-900/80 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-white resize-none"
            />

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-600/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing text...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Check Writing
                  </>
                )}
              </button>
              
              <button 
                onClick={handleReset}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                title="Clear Text"
              >
                <ListRestart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Output Diagnostics Panel: spans 3 cols */}
        <div className="lg:col-span-3 h-full overflow-y-auto pr-1 min-h-0">
          {result ? (
            <div className="space-y-6">
              
              {/* Scores breakdown card */}
              <div className="grid grid-cols-4 gap-3 bg-gradient-to-tr from-brand-600/20 to-brand-850/50 p-4 rounded-2xl border border-brand-500/25">
                {[
                  { label: 'Overall', val: result.scores.overall },
                  { label: 'Grammar', val: result.scores.grammar },
                  { label: 'Vocabulary', val: result.scores.vocabulary },
                  { label: 'Coherence', val: result.scores.coherence }
                ].map((s, i) => (
                  <div key={i} className="text-center p-2 bg-brand-900/60 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase block">{s.label}</span>
                    <span className="text-lg md:text-xl font-black text-brand-400 mt-1 block">{s.val}%</span>
                  </div>
                ))}
              </div>

              {/* Corrected Text vs Native Text Display */}
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Syntactically Corrected Text</span>
                    <button 
                      onClick={() => handleSpeak(result.correctedText)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 mt-1.5">{result.correctedText}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Apple-Grade Premium Native Phrasing</span>
                    <button 
                      onClick={() => handleSpeak(result.betterNativeVersion)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-brand-300 leading-relaxed bg-brand-500/5 p-3 rounded-xl border border-brand-500/10 mt-1.5 italic font-medium">&ldquo;{result.betterNativeVersion}&rdquo;</p>
                </div>
              </div>

              {/* Detailed Mistakes breakdown */}
              {result.errors.length > 0 && (
                <div className="glass-card p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Errors Identified ({result.errors.length})</span>
                  <div className="space-y-3">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="p-3 bg-brand-900/50 rounded-xl border border-white/5 flex gap-3 text-xs leading-relaxed">
                        <div className="mt-0.5">
                          {err.type === 'grammar' ? (
                            <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 font-bold">
                            <span className="text-rose-400 line-through">{err.original}</span>
                            <span className="text-gray-500">&rarr;</span>
                            <span className="text-emerald-400">{err.corrected}</span>
                            <span className="text-[9px] bg-white/10 text-gray-400 px-1 py-0.2 rounded font-extrabold uppercase tracking-wide ml-2">{err.type}</span>
                          </div>
                          <p className="text-gray-400">{err.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structural and style analysis */}
              <div className="glass-card p-5 rounded-2xl space-y-2">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Structural & Coherence Remarks</span>
                <p className="text-xs text-gray-300 leading-relaxed">{result.structuralAnalysis}</p>
              </div>

              {/* Vocab upgrades suggestions */}
              {result.vocabularyUpgrades && result.vocabularyUpgrades.length > 0 && (
                <div className="glass-card p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Lexical Upgrades Ledger</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.vocabularyUpgrades.map((v, idx) => (
                      <div key={idx} className="p-3 bg-brand-900/80 rounded-xl border border-brand-500/10 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 line-through">{v.originalWord}</span>
                          <span className="text-gray-500">&rarr;</span>
                          <span className="text-xs font-bold text-brand-400">{v.upgrade}</span>
                        </div>
                        <p className="text-[11px] text-gray-300">{v.meaning}</p>
                        <p className="text-[10px] text-gray-500 italic">&ldquo;{v.example}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation quote */}
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 text-emerald-300 text-xs font-semibold rounded-2xl text-center leading-relaxed">
                🚀 {result.motivation}
              </div>

            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center text-gray-500 gap-3 border-dashed border-white/10 h-full">
              <Languages className="w-10 h-10 text-gray-600" />
              <p className="text-xs leading-relaxed max-w-sm font-medium">
                Analysis summary will appear here once you enter a piece of writing and trigger analysis checking.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
