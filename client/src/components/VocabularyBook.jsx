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
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

export default function VocabularyBook() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  
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
        const catRes = await axios.get('/api/vocabulary/categories');
        setCategories(catRes.data);
        
        const statsRes = await axios.get('/api/vocabulary/stats');
        setStats(statsRes.data);
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
        const res = await axios.get('/api/vocabulary', {
          params: {
            page,
            limit,
            search,
            category,
            difficulty,
            partOfSpeech
          }
        });
        setWords(res.data.words);
        setTotalPages(res.data.totalPages);
        setTotalWords(res.data.totalWords);
      } catch (err) {
        console.error('Could not fetch vocabulary words:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid excessive requests
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
    <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
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
      <div className="glass-card p-4 rounded-2xl shrink-0 space-y-3 border-white/5">
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

      {/* Content Layout Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main List */}
        <div className="lg:col-span-2 flex flex-col justify-between overflow-hidden glass-card rounded-2xl border-white/5">
          
          <div className="flex-1 min-h-0 overflow-y-auto">
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
                    onClick={() => setSelectedWord(w)}
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

          {/* Pagination Controls */}
          <div className="shrink-0 p-4 border-t border-white/5 bg-brand-850/40 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">
              Page {page} of {totalPages || 1} ({totalWords} words total)
            </span>
            
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 rounded-xl text-white transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 rounded-xl text-white transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Selected Word Details Panel */}
        <div className="lg:col-span-1">
          {selectedWord ? (
            <div className="glass-card p-6 rounded-2xl border-brand-500/20 space-y-4 animate-fadeIn flex flex-col justify-between h-full">
              
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
