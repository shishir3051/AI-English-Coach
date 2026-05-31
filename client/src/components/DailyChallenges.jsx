import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ArrowRight,
  Flame,
  Award,
  BookMarked,
  Loader2,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

export default function DailyChallenges({ progress, fetchProgress }) {
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [reorderedBlocks, setReorderedBlocks] = useState([]);
  
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Fetch today's challenges from DB
  const fetchChallenges = async () => {
    setChallengesLoading(true);
    try {
      const res = await axios.get('/api/challenges/daily');
      setChallenges(res.data);
    } catch (err) {
      console.warn('Could not load challenges from DB, using fallback.', err.message);
      setChallenges([
        {
          id: "challenge_error_1", type: "error",
          title: "Spot & Correct the Error",
          instruction: "Identify the mistake in the sentence and type the fully corrected sentence.",
          sentence: "She don't likes apples because they is sour.",
          correctAnswer: "She doesn't like apples because they are sour.",
          optionsHint: "Watch out for subject-verb agreement and present tense singular negatives.",
          points: 15
        },
        {
          id: "challenge_vocab_1", type: "vocab",
          title: "Synonym Matcher",
          instruction: "Select the word closest in meaning to: 'ELOQUENT'",
          options: ["Quiet", "Persuasive and fluent", "Hesitant", "Loud"],
          answerIndex: 1,
          explanation: "Eloquent (/ˈel.ə.kwənt/) means fluent or persuasive in speaking or writing.",
          points: 10
        },
        {
          id: "challenge_reorder_1", type: "reorder",
          title: "Sentence Reconstructor",
          instruction: "Reorder the words to construct a grammatically correct sentence.",
          blocks: ["English", "she", "fluently", "speaks", "every day"],
          correctSequence: "she speaks English fluently every day",
          points: 15
        }
      ]);
    } finally {
      setChallengesLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const activeChallenge = challenges[activeIdx];

  const resetState = () => {
    setTextAnswer('');
    setSelectedIdx(null);
    setReorderedBlocks([]);
    setSubmitted(false);
    setIsCorrect(false);
    setRewardClaimed(false);
  };

  const handleSelectOption = (idx) => { if (!submitted) setSelectedIdx(idx); };

  const handleBlockClick = (block) => {
    if (submitted) return;
    if (reorderedBlocks.includes(block)) {
      setReorderedBlocks(prev => prev.filter(b => b !== block));
    } else {
      setReorderedBlocks(prev => [...prev, block]);
    }
  };

  const handleSubmit = () => {
    if (submitted || !activeChallenge) return;

    let correct = false;
    if (activeChallenge.type === 'error') {
      const userText = textAnswer.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const answerText = activeChallenge.correctAnswer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      correct = userText === answerText;
    } else if (activeChallenge.type === 'vocab') {
      correct = selectedIdx === activeChallenge.answerIndex;
    } else if (activeChallenge.type === 'reorder') {
      const userReorder = reorderedBlocks.join(' ').toLowerCase();
      const correctReorder = activeChallenge.correctSequence.toLowerCase();
      correct = userReorder === correctReorder;
    }

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleClaimReward = async () => {
    if (rewardClaimed || !activeChallenge) return;
    setRewardClaimed(true);
    try {
      await axios.post('/api/progress/challenge', {
        type: activeChallenge.type,
        score: isCorrect ? activeChallenge.points : 0
      });
      fetchProgress();
    } catch (err) {
      console.warn('Backend is offline. Score updated locally.', err.message);
    }
  };

  const handleNextChallenge = () => {
    const nextIdx = activeIdx + 1;
    if (nextIdx < challenges.length) {
      setActiveIdx(nextIdx);
      resetState();
    } else {
      alert("All daily challenges completed! Check back tomorrow for new ones.");
    }
  };

  const handleRefreshChallenges = () => {
    setActiveIdx(0);
    resetState();
    fetchChallenges();
  };

  if (challengesLoading) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading today's challenges...</p>
        </div>
      </div>
    );
  }

  if (!activeChallenge) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Trophy className="w-12 h-12 text-amber-400" />
          <p className="text-white font-bold">No challenges found!</p>
          <button onClick={handleRefreshChallenges} className="px-4 py-2 bg-brand-600 text-white text-sm rounded-xl font-bold">
            Reload Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 space-y-5 overflow-y-auto pr-1 pb-2">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-400" /> Daily Training Challenges
          </h2>
          <p className="text-xs text-gray-500">Solve daily mini-tasks to boost your fluency metrics and maintain your streak.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshChallenges}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all hover:scale-105"
            title="Get new challenges"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-amber-500/15 text-amber-400 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold font-mono">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> STREAK: {progress.streak || 0} DAYS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Challenge Board */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-3xl space-y-5 flex flex-col justify-between min-h-[450px]">
            
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                  Challenge {activeIdx + 1} of {challenges.length}
                </span>
                <span className="text-xs text-gray-500 font-bold font-mono">
                  Points: +{activeChallenge.points} XP
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-black text-white">{activeChallenge.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{activeChallenge.instruction}</p>
              </div>

              <div className="mt-6">
                {/* Error Spotter */}
                {activeChallenge.type === 'error' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-900 border border-rose-500/20 rounded-xl">
                      <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Flawed Sentence</span>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed mt-1 italic">&ldquo;{activeChallenge.sentence}&rdquo;</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase">Type Correct Answer</span>
                      <input 
                        type="text"
                        value={textAnswer}
                        disabled={submitted}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type corrected sentence here..."
                        className="w-full px-4 py-3 bg-brand-900/60 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-white disabled:opacity-55"
                      />
                    </div>
                  </div>
                )}

                {/* Vocabulary Choice */}
                {activeChallenge.type === 'vocab' && (
                  <div className="space-y-2.5">
                    {activeChallenge.options.map((opt, idx) => {
                      let btnStyle = "bg-brand-900/60 border-white/5 hover:border-white/20 text-gray-300";
                      if (selectedIdx === idx) btnStyle = "bg-brand-500/10 border-brand-500 text-brand-300 font-semibold";
                      if (submitted) {
                        if (idx === activeChallenge.answerIndex) btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold";
                        else if (selectedIdx === idx) btnStyle = "bg-rose-500/10 border-rose-500 text-rose-300 line-through";
                        else btnStyle = "bg-brand-900/30 border-white/5 text-gray-500";
                      }
                      return (
                        <button
                          key={idx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Reorder Blocks */}
                {activeChallenge.type === 'reorder' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-900 border border-dashed border-white/10 rounded-xl min-h-[50px] flex flex-wrap gap-2 items-center">
                      {reorderedBlocks.length === 0 ? (
                        <span className="text-[11px] text-gray-500 italic">Click words below to assemble your sentence...</span>
                      ) : (
                        reorderedBlocks.map((b, idx) => (
                          <span 
                            key={idx} 
                            onClick={() => handleBlockClick(b)}
                            className="px-2.5 py-1 bg-brand-500/10 text-brand-300 rounded border border-brand-500/20 text-xs font-bold cursor-pointer hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-300 transition-all"
                          >
                            {b}
                          </span>
                        ))
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Available Words</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {activeChallenge.blocks.map((block, idx) => {
                          const isSelected = reorderedBlocks.includes(block);
                          return (
                            <button
                              key={idx}
                              disabled={submitted || isSelected}
                              onClick={() => handleBlockClick(block)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                isSelected 
                                  ? 'bg-brand-900/30 border-white/5 text-gray-500 scale-95' 
                                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {block}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Result & Actions */}
            <div className="space-y-4">
              {submitted && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed flex gap-3 ${
                  isCorrect 
                    ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300' 
                    : 'bg-rose-500/5 border-rose-500/15 text-rose-300'
                }`}>
                  <div className="mt-0.5">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-[10px] uppercase">
                      {isCorrect ? "Correct! Reward Ready" : "Answer Mismatch"}
                    </p>
                    <p className="text-gray-300">
                      {activeChallenge.type === 'error' && (
                        <>Correct sentence: <span className="font-bold text-white">{activeChallenge.correctAnswer}</span>. {activeChallenge.optionsHint}</>
                      )}
                      {activeChallenge.type === 'vocab' && activeChallenge.explanation}
                      {activeChallenge.type === 'reorder' && (
                        <>Correct ordering: <span className="font-bold text-white">&ldquo;{activeChallenge.correctSequence}&rdquo;</span>.</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={
                    (activeChallenge.type === 'error' && !textAnswer.trim()) ||
                    (activeChallenge.type === 'vocab' && selectedIdx === null) ||
                    (activeChallenge.type === 'reorder' && reorderedBlocks.length === 0)
                  }
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Submit Challenge
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleClaimReward}
                    disabled={rewardClaimed}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      rewardClaimed 
                        ? 'bg-white/5 border border-white/5 text-gray-500 cursor-default' 
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/15'
                    }`}
                  >
                    {rewardClaimed ? "Reward Claimed ✓" : `Claim +${isCorrect ? activeChallenge.points : 2} XP`}
                  </button>
                  <button
                    onClick={handleNextChallenge}
                    disabled={activeIdx + 1 === challenges.length}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center shrink-0"
                    title="Next Challenge"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-5 rounded-3xl space-y-4">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Challenge Info</span>
            <div className="space-y-3.5 text-xs text-gray-300 leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-white">Daily Streak Lock-in</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Completing at least one challenge daily guarantees your streak stays active.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-white">Earn Competency XP</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Correct submissions boost your overall confidence level. Incorrect claims reward partial buffer points.</p>
                </div>
              </div>

              {/* Today's progress */}
              <div className="mt-4 p-3 bg-brand-500/5 border border-brand-500/10 rounded-xl space-y-2">
                <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wider">Today's Progress</span>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Challenges Done</span>
                  <span className="text-white font-bold text-xs">{activeIdx}/{challenges.length}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${(activeIdx / challenges.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
