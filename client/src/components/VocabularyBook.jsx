import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Loader2, 
  Sparkles,
  RefreshCw,
  Info,
  Calendar,
  CheckCircle,
  X,
  Home,
  Mic,
  BookMarked,
  Trophy,
  Library
} from 'lucide-react';
import axios from 'axios';

export default function VocabularyBook() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const limit = 20;

  // Selected word details modal/card
  const [selectedWord, setSelectedWord] = useState(null);

  // Fetch unique categories and stats on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Simulated data for demonstration
        setCategories(['Atom', 'August', 'Australia', 'Bad bag', 'Bad book', 'Science', 'Travel', 'Everyday']);
        setStats({ total: 3317 });
      } catch (err) {
        console.warn('Could not load vocabulary metadata.', err.message);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch words whenever page, filters, or search term changes
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        // Simulated data for demonstration
        const mockWords = Array(limit).fill(null).map((_, idx) => ({
          _id: `${page}-${idx}`,
          english: ['Atom', 'August', 'Australia', 'Bad bag', 'Bad book', 'Computer', 'Language', 'Beautiful', 'Quickly', 'Understand'][idx % 10],
          bangla: ['পরমাণু', 'আগষ্ট', 'অস্ট্রেলিয়া', 'খারাপ ব্যাগ', 'খারাপ বই', 'কম্পিউটার', 'ভাষা', 'সুন্দর', 'দ্রুত', 'বোঝা'][idx % 10],
          category: ['Science', 'Months', 'Countries', 'Phrase', 'Phrase', 'Technology', 'Linguistics', 'Adjective', 'Adverb', 'Verb'][idx % 10],
          difficulty: ['beginner', 'beginner', 'beginner', 'beginner', 'beginner', 'intermediate', 'beginner', 'beginner', 'intermediate', 'advanced'][idx % 10],
          partOfSpeech: ['noun', 'noun', 'noun', 'phrase', 'phrase', 'noun', 'noun', 'adjective', 'adverb', 'verb'][idx % 10],
          pronunciation: `/ˈæt.əm/`,
          example: `This is an example sentence with ${['Atom', 'August', 'Australia'][idx % 3]}.`,
          exampleBangla: `এটি ${['Atom', 'August', 'Australia'][idx % 3]} সহ একটি উদাহরণ বাক্য।`,
          synonyms: ['particle', 'month', 'country', 'bag', 'book']
        }));
        
        setWords(mockWords);
        setTotalPages(Math.ceil(3317 / limit));
        setTotalWords(3317);
      } catch (err) {
        console.error('Could not fetch vocabulary words:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchWords();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, category, difficulty, partOfSpeech]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty, partOfSpeech]);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setPartOfSpeech('');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5 h-screen overflow-x-hidden overflow-y-auto pb-32 bg-gradient-to-br from-[#0a0815] via-[#0f0c1d] to-[#0a0815]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 px-4 pt-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" /> English-Bangla Vocabulary Bank
          </h2>
          <p className="text-xs text-gray-500">Explore over 3,000+ words, translations, examples, and correct pronunciations.</p>
        </div>

        {/* Stats Summary Bubble */}
        {stats && (
          <div className="flex items-center gap-4 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-2xl text-xs">
            <div>
              <span className="text-gray-400">Total Words: </span>
              <span className="font-extrabold text-white font-mono">{stats.total}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <span className="text-brand-300 font-extrabold">3000+ Bilingual Ledger Loaded</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="glass-card p-4 rounded-2xl shrink-0 border-white/5 mx-4">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <button
            onClick={() => setFiltersOpen((open) => !open)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-brand-900 border border-white/10 rounded-2xl text-left text-sm text-white"
            aria-expanded={filtersOpen}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-300" />
              <span className="font-semibold">Search & Filters</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{[search, category, difficulty, partOfSpeech].filter(Boolean).length ? 'Filters active' : 'Tap to expand'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-90' : ''}`} />
            </div>
          </button>
        </div>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block space-y-3`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Search Box */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search English or Bangla..."
                className="w-full pl-10 pr-4 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-white"
              />
            </div>

            {/* Category Filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-gray-300 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-[10px]">▼</div>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-gray-300 appearance-none cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-[10px]">▼</div>
          </div>

          {/* Part of Speech Filter */}
          <div className="relative">
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-gray-300 appearance-none cursor-pointer"
            >
              <option value="">All Parts of Speech</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="phrase">Phrase</option>
              <option value="idiom">Idiom</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-[10px]">▼</div>
          </div>

        </div>

        {/* Clear Filters indicator */}
        {(search || category || difficulty || partOfSpeech) && (
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5">
            <span className="text-gray-400">Found {totalWords} matching words</span>
            <button
              onClick={clearFilters}
              className="text-brand-400 hover:text-brand-300 font-extrabold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear Filters
            </button>
          </div>
        )}
      </div>
 </div> 
      {/* Content Layout Grid */}
     <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 flex-1 min-h-0 px-4">
        
        {/* Main List */}
        <div className="lg:col-span-2 flex flex-col glass-card rounded-2xl border-white/5 min-h-[340px] overflow-hidden">
          
          <div className="flex-1 overflow-y-auto min-h-[260px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                  <span className="text-xs text-gray-400">Filtering vocabulary book...</span>
                </div>
              </div>
            ) : words.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 gap-2">
                <Info className="w-8 h-8 text-gray-600" />
                <p className="text-sm font-bold">No vocabulary words match your criteria.</p>
                <p className="text-xs max-w-xs leading-relaxed">Try typing another query or selecting a different category.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {words.map((w) => (
                  <div
                    key={w._id}
                   onClick={() => setSelectedWord(selectedWord?._id === w._id ? null : w)}
                    className={`p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all ${
                      selectedWord?._id === w._id ? 'bg-brand-500/10 border-l-4 border-brand-500' : ''
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">{w.english}</span>
                        <span className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold border border-white/5">
                          {w.partOfSpeech}
                        </span>
                        {w.difficulty === 'advanced' && (
                          <span className="text-[9px] uppercase font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                            Advanced
                          </span>
                        )}
                        {w.difficulty === 'intermediate' && (
                          <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            Inter
                          </span>
                        )}
                        {w.difficulty === 'beginner' && (
                          <span className="text-[9px] uppercase font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Beginner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 truncate font-medium">{w.bangla}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] bg-brand-500/20 text-brand-300 px-2.5 py-1 rounded-xl font-bold">
                        {w.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(w.english);
                        }}
                        className="p-2 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Pronounce word"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls - Always Visible on Mobile & Desktop */}
          <div className="shrink-0 p-4 border-t border-white/5 bg-brand-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-gray-400 font-mono text-center sm:text-left">
              Page {page} of {totalPages || 1} ({totalWords} words total)
            </span>
            
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 rounded-xl text-white transition-all flex items-center justify-center min-w-[40px]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  if (pageNum >= 1 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 rounded-xl text-white transition-all flex items-center justify-center min-w-[40px]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Selected Word Details Panel - Mobile inline section */}
        <div className="lg:hidden">
          {selectedWord ? (
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-4 mt-4">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-wide">{selectedWord.english}</h3>
                  {selectedWord.pronunciation && (
                    <p className="text-xs font-mono text-gray-500">{selectedWord.pronunciation}</p>
                  )}
                </div>
                <button
                  onClick={() => handleSpeak(selectedWord.english)}
                  className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Bengali Meaning</span>
                  <p className="text-sm text-brand-300 font-bold mt-1 bg-brand-500/5 px-3 py-2 rounded-xl border border-brand-500/10">
                    {selectedWord.bangla}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Category</span>
                    <span className="mt-1 inline-block bg-white/5 px-2.5 py-1 rounded-xl text-white font-bold border border-white/5">{selectedWord.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Part of Speech</span>
                    <span className="mt-1 inline-block bg-white/5 px-2.5 py-1 rounded-xl text-brand-300 font-bold border border-white/5 uppercase">{selectedWord.partOfSpeech}</span>
                  </div>
                </div>

                {selectedWord.example && (
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Usage Example</span>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1.5 mt-1">
                      <p className="text-gray-200 font-medium italic">&ldquo;{selectedWord.example}&rdquo;</p>
                      {selectedWord.exampleBangla && (
                        <p className="text-gray-400">&ldquo;{selectedWord.exampleBangla}&rdquo;</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Synonyms</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {selectedWord.synonyms.map((s, idx) => (
                        <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-lg text-[11px] font-bold">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 rounded-2xl border-white/10 mt-4 text-center text-gray-500">
              <BookOpen className="mx-auto mb-2 w-8 h-8 text-gray-600" />
              <p className="text-xs leading-relaxed font-semibold">
                Tap any word card to reveal details, example usage, and pronunciation.
              </p>
            </div>
          )}
        </div>

        {/* Selected Word Details Panel - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          {selectedWord ? (
            <div className="glass-card p-6 rounded-2xl border-brand-500/20 space-y-4 animate-fadeIn flex flex-col justify-between h-full sticky top-20">
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white tracking-wide">{selectedWord.english}</h3>
                    {selectedWord.pronunciation && (
                      <p className="text-xs font-mono text-gray-500">{selectedWord.pronunciation}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSpeak(selectedWord.english)}
                    className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all hover:scale-105"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Bengali Meaning</span>
                    <p className="text-sm text-brand-300 font-bold mt-1 bg-brand-500/5 px-3 py-2 rounded-xl border border-brand-500/10">
                      {selectedWord.bangla}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Category</span>
                      <span className="mt-1 inline-block bg-white/5 px-2.5 py-1 rounded-xl text-white font-bold border border-white/5">
                        {selectedWord.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Part of Speech</span>
                      <span className="mt-1 inline-block bg-white/5 px-2.5 py-1 rounded-xl text-brand-300 font-bold border border-white/5 uppercase">
                        {selectedWord.partOfSpeech}
                      </span>
                    </div>
                  </div>

                  {selectedWord.example && (
                    <div className="pt-2">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase">Usage Example</span>
                      <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1.5 mt-1">
                        <p className="text-gray-200 font-medium italic">&ldquo;{selectedWord.example}&rdquo;</p>
                        {selectedWord.exampleBangla && (
                          <p className="text-gray-400 font-normal leading-relaxed">&ldquo;{selectedWord.exampleBangla}&rdquo;</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase">Synonyms</span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {selectedWord.synonyms.map((s, idx) => (
                          <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-brand-500/5 border border-brand-500/10 text-brand-300 text-[11px] font-bold rounded-2xl flex items-start gap-2.5 mt-4 leading-relaxed">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-brand-400" />
                <span>Tip: Listen to the pronunciation multiple times and construct your own sentences in AI Coach mode to lock it in your memory streak.</span>
              </div>

            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center text-gray-500 gap-3 border-dashed border-white/10 h-full">
              <BookOpen className="w-8 h-8 text-gray-600" />
              <p className="text-xs leading-relaxed max-w-xs font-semibold">
                Click any word in the ledger list to show complete detail views, synonyms, and context usage sentences.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}