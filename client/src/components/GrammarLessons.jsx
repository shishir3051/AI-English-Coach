import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ArrowRight,
  GraduationCap,
  Volume2
} from 'lucide-react';
import axios from 'axios';

export default function GrammarLessons({ progress, fetchProgress }) {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Quiz specific states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFinishNote, setQuizFinishNote] = useState('');

  const getMastery = (lessonId) => {
    const q = (progress?.quizzes || []).find((x) => x.topicId === lessonId);
    if (!q) return 'none';
    const pct = q.bestScore ?? Math.round(((q.score || 0) / (q.totalQuestions || 1)) * 100);
    if (pct >= 80) return 'mastered';
    if (pct >= 50) return 'progress';
    return 'started';
  };

  const masteryStyles = {
    mastered: 'ring-2 ring-emerald-500/40 bg-emerald-500/5',
    progress: 'ring-2 ring-amber-500/30 bg-amber-500/5',
    started: 'ring-1 ring-white/10',
    none: '',
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get('/api/grammar/lessons');
        setLessons(res.data);
      } catch (err) {
        console.warn('Backend not running. Using local fallback list of grammar rules.', err.message);
        // Fallback static list (just in case)
        setLessons([
          {
            id: "articles",
            letter: "A",
            title: "Articles (A, An, The)",
            explanation: "Articles define nouns as specific or unspecific. 'A' and 'an' are indefinite (referring to non-specific items), while 'the' is definite (referring to a specific item). Use 'a' before consonant sounds (a university, a dog) and 'an' before vowel sounds (an hour, an apple).",
            examples: [
              "I saw an elephant at the zoo. (Any elephant, but a specific zoo)",
              "He is a doctor. (One of many doctors)",
              "The sun is bright today. (Only one sun exists)"
            ],
            quiz: [
              {
                question: "Choose the correct sentence:",
                options: [
                  "She wants to buy an honest horse.",
                  "She wants to buy a honest horse.",
                  "She wants to buy the honest horse."
                ],
                answer: 0,
                explanation: "'Honest' starts with a silent 'h', producing a vowel sound (/ˈɒn.ɪst/), so we use 'an'."
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizFinishNote('');
  };

  const handleOptionSelect = (idx) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || submitted) return;
    
    const currentQuestion = selectedLesson.quiz[quizIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setSubmitted(true);
  };

  const handleNextQuiz = async () => {
    const nextIndex = quizIndex + 1;
    if (nextIndex < selectedLesson.quiz.length) {
      setQuizIndex(nextIndex);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      setQuizFinished(true);
      const finalScore = quizScore;

      try {
        const res = await axios.post('/api/progress/quiz', {
          topicId: selectedLesson.id,
          topicName: selectedLesson.title,
          score: finalScore,
          totalQuestions: selectedLesson.quiz.length,
        });
        const pct = Math.round((finalScore / selectedLesson.quiz.length) * 100);
        const conf = res.data?.confidenceScore;
        setQuizFinishNote(
          conf != null
            ? `Confidence score is now ${conf}% (+1% for completing this quiz). Best: ${pct}%`
            : `You scored ${pct}% on this topic.`
        );
        fetchProgress?.();
      } catch (err) {
        console.warn('Unable to save quiz results on server.', err.message);
        setQuizFinishNote(`Saved locally: ${finalScore}/${selectedLesson.quiz.length} correct.`);
      }
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold">Loading grammar syllabus...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 space-y-5 overflow-y-auto pr-1 pb-24 lg:pb-2">
      
      {!selectedLesson ? (
        // A to Z Lesson list grid
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5.5 h-5.5 text-brand-400" /> Grammar Classroom: A to Z
            </h2>
            <p className="text-xs text-gray-500">Structured syntax classes containing definitions, standard exercises, and self-checks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map(lesson => {
              const mastery = getMastery(lesson.id);
              return (
              <div 
                key={lesson.id}
                onClick={() => startLesson(lesson)}
                className={`glass-card glass-card-hover p-4 rounded-2xl flex items-center gap-4 cursor-pointer ${masteryStyles[mastery]}`}
              >
                <div className={`w-12 h-12 rounded-xl font-black text-lg flex items-center justify-center shadow-md shrink-0 ${
                  mastery === 'mastered'
                    ? 'bg-emerald-600 text-white'
                    : mastery === 'progress'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gradient-to-tr from-brand-600 to-violet-400 text-white'
                }`}>
                  {lesson.letter}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-white truncate">{lesson.title}</h3>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{lesson.explanation}</p>
                  {lesson.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {lesson.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-brand-500/10 text-brand-300 rounded font-bold uppercase">
                          {tag.replace('ielts-', 'IELTS ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {mastery === 'mastered' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </div>
            );})}
          </div>
        </div>
      ) : (
        // Lesson detail & Quiz board
        <div className="space-y-5 animate-fadeIn overflow-y-auto pr-1 pb-24 lg:pb-2">
          
          {/* Header */}
          <button 
            onClick={() => setSelectedLesson(null)}
            className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-extrabold uppercase"
          >
            <ChevronLeft className="w-4.5 h-4.5" /> Back to Lessons
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Col: Explanations - 3 cols */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-violet-400 text-white rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg">
                    {selectedLesson.letter}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedLesson.title}</h3>
                    <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Grammar Lesson</span>
                  </div>
                </div>

                <div className="space-y-2 leading-relaxed">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Explanation & Rule Set</span>
                  <p className="text-xs text-gray-300 text-justify whitespace-pre-line">{selectedLesson.explanation}</p>
                </div>

                {selectedLesson.examples && selectedLesson.examples.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Practical Examples</span>
                    <ul className="space-y-2">
                      {selectedLesson.examples.map((ex, index) => (
                        <li key={index} className="flex gap-2 p-3 bg-brand-900/60 rounded-xl border border-white/5 text-xs text-gray-300">
                          <button 
                            onClick={() => handleSpeak(ex)}
                            className="p-1 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded shrink-0 h-6 w-6 flex items-center justify-center"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="mt-0.5">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Quiz panel - 2 cols */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-3xl h-full flex flex-col justify-between min-h-[400px]">
                
                {!quizFinished ? (
                  // Quiz active
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" /> Lesson Practice Quiz
                        </span>
                        <span className="text-xs text-gray-500 font-bold font-mono">
                          Q: {quizIndex + 1}/{selectedLesson.quiz.length}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-relaxed mt-4">
                        {selectedLesson.quiz[quizIndex].question}
                      </h4>

                      <div className="space-y-2.5 mt-4">
                        {selectedLesson.quiz[quizIndex].options.map((opt, i) => {
                          let optStyle = "bg-brand-900/60 border-white/5 hover:border-white/20 text-gray-300";
                          if (selectedOption === i) {
                            optStyle = "bg-brand-500/10 border-brand-500 text-brand-300 font-semibold";
                          }
                          if (submitted) {
                            if (i === selectedLesson.quiz[quizIndex].answer) {
                              optStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold";
                            } else if (selectedOption === i) {
                              optStyle = "bg-rose-500/10 border-rose-500 text-rose-300 line-through";
                            } else {
                              optStyle = "bg-brand-900/40 border-white/5 text-gray-500";
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={submitted}
                              onClick={() => handleOptionSelect(i)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {submitted && i === selectedLesson.quiz[quizIndex].answer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                              {submitted && selectedOption === i && i !== selectedLesson.quiz[quizIndex].answer && (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanations shown after submit */}
                    <div className="space-y-4">
                      {submitted && (
                        <div className="p-3 bg-brand-900/80 rounded-xl border border-brand-500/10 text-xs text-gray-400 mt-3">
                          <p className="font-extrabold text-[10px] text-brand-300 uppercase tracking-wide">EXPLANATION</p>
                          <p className="mt-1 leading-relaxed">{selectedLesson.quiz[quizIndex].explanation}</p>
                        </div>
                      )}

                      {!submitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={selectedOption === null}
                          className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuiz}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          {quizIndex + 1 < selectedLesson.quiz.length ? (
                            <>
                              Next Question <ArrowRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Finish Quiz <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                  </div>
                ) : (
                  // Quiz finished
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
                    <div className="p-4 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">Assessment Complete!</h4>
                      <p className="text-xs text-gray-500">You scored {quizScore} out of {selectedLesson.quiz.length} on this grammar check.</p>
                    </div>
                    <div className="py-2.5 px-4 bg-white/5 border border-white/5 rounded-xl font-bold text-xs text-brand-400">
                      {quizFinishNote || 'Quiz saved to your progress.'}
                    </div>
                    <button
                      onClick={() => startLesson(selectedLesson)}
                      className="mt-2 w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Try Quiz Again
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
