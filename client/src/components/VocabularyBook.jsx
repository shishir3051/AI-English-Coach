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
  X,
  Home,
  Mic,
  Plus,
  Trophy,
  Library
} from 'lucide-react';
import axios from 'axios';

const PART_OF_SPEECH_LABELS = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  interjection: 'Interjection',
  pronoun: 'Pronoun',
  phrase: 'Phrase',
  idiom: 'Idiom',
};

const FALLBACK_PARTS_OF_SPEECH = Object.entries(PART_OF_SPEECH_LABELS).map(([value, label]) => ({
  value,
  label,
}));

function formatPartOfSpeech(pos) {
  if (!pos) return '—';
  const s = String(pos).trim();
  const lower = s.toLowerCase();
  if (PART_OF_SPEECH_LABELS[lower]) return PART_OF_SPEECH_LABELS[lower];
  if (/^nouns?$/i.test(s)) return 'Noun';
  if (/^verbs?$/i.test(s)) return 'Verb';
  if (/^(adjectives?|adj\.?)$/i.test(s)) return 'Adjective';
  if (/^(adverbs?|adv\.?)$/i.test(s)) return 'Adverb';
  if (/^(prepositions?|prep\.?)$/i.test(s)) return 'Preposition';
  if (/^(conjunctions?|conj\.?)$/i.test(s)) return 'Conjunction';
  if (/^(interjections?|intj\.?)$/i.test(s)) return 'Interjection';
  if (/^(pronouns?|pron\.?)$/i.test(s)) return 'Pronoun';
  if (/^phrases?$/i.test(s)) return 'Phrase';
  if (/^idioms?$/i.test(s)) return 'Idiom';
  return s;
}

export default function VocabularyBook() {
  const [customWord, setCustomWord] = useState('');
  const [addWordStatus, setAddWordStatus] = useState(null);
  const [addWordLoading, setAddWordLoading] = useState(false);
  const [listRefresh, setListRefresh] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const limit = 20;

  // Selected word details modal/card
  const [selectedWord, setSelectedWord] = useState(null);
  const [error, setError] = useState(null);

  // Fetch unique categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/vocabulary/categories');
        setCategories(Array.isArray(response.data) ? response.data : ['Science', 'Travel', 'Everyday', 'Business', 'Education']);
      } catch (err) {
        console.warn('Could not load categories:', err.message);
        // Fallback categories
        setCategories(['Science', 'Travel', 'Everyday', 'Business', 'Education']);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPartsOfSpeech = async () => {
      try {
        const response = await axios.get('/api/vocabulary/parts-of-speech');
        const fromApi = Array.isArray(response.data) ? response.data : [];
        const countByValue = Object.fromEntries(fromApi.map((o) => [o.value, o.count]));
        setPartsOfSpeechOptions(
          FALLBACK_PARTS_OF_SPEECH.map((opt) => ({
            ...opt,
            count: countByValue[opt.value] ?? 0,
          }))
        );
      } catch (err) {
        console.warn('Could not load parts of speech:', err.message);
        setPartsOfSpeechOptions(FALLBACK_PARTS_OF_SPEECH);
      }
    };
    fetchPartsOfSpeech();
  }, []);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/vocabulary/stats');
        setStats(response.data && typeof response.data === 'object' ? response.data : { total: 0 });
      } catch (err) {
        console.warn('Could not load stats:', err.message);
        setStats({ total: 0 });
      }
    };
    fetchStats();
  }, []);

  // Fetch words whenever page, filters, or search term changes
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        
        if (search.trim()) params.append('search', search.trim());
        if (category) params.append('category', category);
        if (difficulty) params.append('difficulty', difficulty);
        if (partOfSpeech) params.append('partOfSpeech', partOfSpeech);
        
        const response = await axios.get(`/api/vocabulary?${params.toString()}`);
        
        const data = response.data || {};
        setWords(Array.isArray(data.words) ? data.words : []);
        setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
        setTotalWords(typeof data.totalWords === 'number' ? data.totalWords : 0);
      } catch (err) {
        console.error('Could not fetch vocabulary words:', err);
        setError(err.response?.data?.error || 'Failed to load vocabulary');
        setWords([]);
        setTotalPages(0);
        setTotalWords(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const delayDebounceFn = setTimeout(() => {
      fetchWords();
    }, search ? 500 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, category, difficulty, partOfSpeech, listRefresh]);

  // Reset page when filters change (except page itself)
  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty, partOfSpeech]);

  const refreshStats = async () => {
    try {
      const response = await axios.get('/api/vocabulary/stats');
      setStats(response.data);
      const catRes = await axios.get('/api/vocabulary/categories');
      setCategories(catRes.data);
    } catch {
      /* ignore */
    }
  };

  const addWordWithAI = async (e) => {
    e?.preventDefault();
    const english = customWord.trim();
    if (!english || addWordLoading) return;

    setAddWordLoading(true);
    setAddWordStatus(null);
    try {
      const res = await axios.post('/api/vocabulary/add', { english });
      const word = res.data.word;
      setCustomWord('');
      setSearch(word.english);
      setPage(1);
      setSelectedWord(word);
      setListRefresh((n) => n + 1);
      await refreshStats();
      setAddWordStatus(res.data.message || (res.data.created ? 'Word added' : 'Word opened'));
      setTimeout(() => setAddWordStatus(null), 4000);
    } catch (err) {
      setAddWordStatus(err.response?.data?.error || 'Could not add word — try again');
      setTimeout(() => setAddWordStatus(null), 4000);
    } finally {
      setAddWordLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Wait for voices to be loaded
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices) return;
        const enVoice = voices.find(v => v.lang === 'en-US') || 
                       voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
      };
      
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    } else {
      console.warn('Speech synthesis not supported');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setPartOfSpeech('');
    setPage(1);
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Get difficulty badge styling
  const getDifficultyBadge = (difficultyLevel) => {
    switch (difficultyLevel) {
      case 'advanced':
        return 'text-rose-300 bg-rose-500/10 border-rose-500/20';
      case 'intermediate':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getDifficultyLabel = (difficultyLevel) => {
    switch (difficultyLevel) {
      case 'advanced': return 'Advanced';
      case 'intermediate': return 'Inter';
      default: return 'Beginner';
    }
  };

  // Active filters count
  const activeFiltersCount = [search, category, difficulty, partOfSpeech].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5 min-h-screen pb-32 bg-gradient-to-br from-[#0a0815] via-[#0f0c1d] to-[#0a0815]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 px-4 pt-6">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" /> English-Bangla Vocabulary Bank
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Explore {stats?.total?.toLocaleString() || '3,000+'} words, translations, examples, and correct pronunciations.
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="flex items-center gap-4 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-2xl text-xs">
            <div>
              <span className="text-gray-400">Total Words: </span>
              <span className="font-extrabold text-white font-mono">{stats.total?.toLocaleString() ?? 0}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <span className="text-brand-300 font-extrabold text-sm">
                📚 {stats.partsOfSpeechTypes ?? stats.partsOfSpeechOptions?.length ?? stats.partsOfSpeech?.length ?? 8} Parts of Speech
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="glass-card p-4 rounded-2xl shrink-0 border-white/5 mx-4">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-brand-900 border border-white/10 rounded-2xl text-left text-sm text-white"
            aria-expanded={filtersOpen}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-300" />
              <span className="font-semibold">Search & Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-brand-500 text-white text-[10px] rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{activeFiltersCount ? `${activeFiltersCount} active` : 'Tap to expand'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-90' : ''}`} />
            </div>
          </button>
        </div>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block space-y-3`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search English or Bangla..."
                className="w-full pl-10 pr-4 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>

            <form onSubmit={addWordWithAI} className="flex gap-2">
              <input
                type="text"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                placeholder="Add a new word (AI fills Bangla, example…)"
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-brand-900 border border-emerald-500/30 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-white placeholder:text-gray-500"
                disabled={addWordLoading}
              />
              <button
                type="submit"
                disabled={addWordLoading || !customWord.trim()}
                className="shrink-0 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {addWordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{addWordLoading ? 'Adding…' : 'Add with AI'}</span>
                <Plus className="w-4 h-4 sm:hidden" />
              </button>
            </form>
          </div>
          {addWordStatus && (
            <p className="text-xs text-emerald-300 font-bold px-1">{addWordStatus}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Category Filter */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-gray-300 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="IELTS">IELTS Topics</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-gray-300 appearance-none cursor-pointer"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner 🌱</option>
                <option value="intermediate">Intermediate 📘</option>
                <option value="advanced">Advanced 🎓</option>
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>

            {/* Part of Speech Filter */}
            <div className="relative">
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-900 border border-white/10 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-gray-300 appearance-none cursor-pointer"
              >
                <option value="">All Parts of Speech</option>
                {partsOfSpeechOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                    {opt.count != null && opt.count > 0 ? ` (${opt.count.toLocaleString()})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>

          {/* Clear Filters indicator */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
              <span className="text-gray-400">
                Found <span className="text-brand-300 font-bold">{totalWords.toLocaleString()}</span> matching words
              </span>
              <button
                onClick={clearFilters}
                className="text-brand-400 hover:text-brand-300 font-extrabold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div> 
      
      {/* Content Layout Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 flex-1 min-h-0 px-4">
        
        {/* Main List */}
        <div className="lg:col-span-2 flex flex-col glass-card rounded-2xl border-white/5 min-h-[440px] overflow-hidden">
          
          <div className="flex-1 overflow-y-auto min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                  <span className="text-sm text-gray-400">Loading vocabulary...</span>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500 gap-3">
                <X className="w-12 h-12 text-red-500/50" />
                <p className="text-sm font-semibold text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-brand-500/20 text-brand-300 rounded-xl text-sm hover:bg-brand-500/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : words.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500 gap-3">
                <BookOpen className="w-12 h-12 text-gray-600" />
                <p className="text-sm font-bold">No vocabulary words match your criteria.</p>
                <p className="text-xs max-w-xs leading-relaxed">
                  Try adjusting your search term or selecting a different category/difficulty level.
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-4 py-2 bg-brand-500/20 text-brand-300 rounded-xl text-sm hover:bg-brand-500/30 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
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
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-base">{w.english}</span>
                        <span className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold border border-white/5">
                          {formatPartOfSpeech(w.partOfSpeech)}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(w.difficulty)}`}>
                          {getDifficultyLabel(w.difficulty)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate font-medium">{w.bangla}</p>
                      {w.pronunciation && (
                        <p className="text-[11px] text-gray-500 font-mono">/{w.pronunciation}/</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] bg-brand-500/20 text-brand-300 px-2.5 py-1.5 rounded-xl font-bold">
                        {w.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(w.english);
                        }}
                        className="p-2.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
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
          {totalPages > 0 && (
            <div className="shrink-0 p-4 border-t border-white/5 bg-brand-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-gray-400 font-mono text-center sm:text-left">
                Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, totalWords)} of {totalWords.toLocaleString()} words
              </span>
              
              <div className="flex gap-2 justify-center sm:justify-end items-center">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition-all flex items-center justify-center min-w-[40px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1.5">
                  {getPaginationNumbers().map((pageNum, idx) => (
                    pageNum === '...' ? (
                      <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
                        ...
                      </span>
                    ) : (
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
                    )
                  ))}
                </div>
                
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition-all flex items-center justify-center min-w-[40px]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Word Details Panel - Mobile */}
        <div className="lg:hidden">
          {selectedWord ? (
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-4 mt-4 animate-fadeIn">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-wide">{selectedWord.english}</h3>
                  {selectedWord.pronunciation && (
                    <p className="text-xs font-mono text-gray-500">/{selectedWord.pronunciation}/</p>
                  )}
                </div>
                <button
                  onClick={() => handleSpeak(selectedWord.english)}
                  className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Bengali Meaning</span>
                  <p className="text-base text-brand-300 font-bold mt-1 bg-brand-500/5 px-3 py-2.5 rounded-xl border border-brand-500/10">
                    {selectedWord.bangla}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Category</span>
                    <span className="mt-1 inline-block bg-white/5 px-3 py-1.5 rounded-xl text-white font-bold border border-white/5 text-sm">
                      {selectedWord.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Part of Speech</span>
                    <span className="mt-1 inline-block bg-white/5 px-3 py-1.5 rounded-xl text-brand-300 font-bold border border-white/5 uppercase text-sm">
                      {formatPartOfSpeech(selectedWord.partOfSpeech)}
                    </span>
                  </div>
                </div>

                {selectedWord.example && (
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Usage Example</span>
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1.5 mt-1">
                      <p className="text-gray-200 font-medium italic text-sm">&ldquo;{selectedWord.example}&rdquo;</p>
                      {selectedWord.exampleBangla && (
                        <p className="text-gray-400 text-sm">&ldquo;{selectedWord.exampleBangla}&rdquo;</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Synonyms</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedWord.synonyms.map((s, idx) => (
                        <span key={idx} className="bg-white/5 px-3 py-1 rounded-lg text-xs font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl border-white/10 mt-4 text-center text-gray-500">
              <BookOpen className="mx-auto mb-3 w-10 h-10 text-gray-600" />
              <p className="text-sm leading-relaxed font-semibold">
                Tap any word to reveal details, example usage, and pronunciation.
              </p>
            </div>
          )}
        </div>

        {/* Selected Word Details Panel - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          {selectedWord ? (
            <div className="glass-card p-6 rounded-2xl border-brand-500/20 space-y-4 animate-fadeIn flex flex-col justify-between h-full sticky top-20">
              
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white tracking-wide">{selectedWord.english}</h3>
                    {selectedWord.pronunciation && (
                      <p className="text-xs font-mono text-gray-500">/{selectedWord.pronunciation}/</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSpeak(selectedWord.english)}
                    className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 border border-brand-500/20 transition-all hover:scale-105"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <div>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Bengali Meaning</span>
                    <p className="text-base text-brand-300 font-bold mt-1.5 bg-brand-500/5 px-3 py-2.5 rounded-xl border border-brand-500/10">
                      {selectedWord.bangla}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Category</span>
                      <span className="mt-1.5 inline-block bg-white/5 px-3 py-1.5 rounded-xl text-white font-bold border border-white/5 text-sm">
                        {selectedWord.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase block tracking-wider">Part of Speech</span>
                      <span className="mt-1.5 inline-block bg-white/5 px-3 py-1.5 rounded-xl text-brand-300 font-bold border border-white/5 uppercase text-sm">
                        {formatPartOfSpeech(selectedWord.partOfSpeech)}
                      </span>
                    </div>
                  </div>

                  {selectedWord.example && (
                    <div className="pt-1">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Usage Example</span>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 mt-1.5">
                        <p className="text-gray-200 font-medium italic text-sm">&ldquo;{selectedWord.example}&rdquo;</p>
                        {selectedWord.exampleBangla && (
                          <p className="text-gray-400 text-sm leading-relaxed">&ldquo;{selectedWord.exampleBangla}&rdquo;</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Synonyms</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedWord.synonyms.map((s, idx) => (
                          <span key={idx} className="bg-white/5 px-3 py-1.5 rounded-lg text-xs font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-brand-500/5 border border-brand-500/10 text-brand-300 text-xs font-bold rounded-2xl flex items-start gap-2.5 leading-relaxed">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-brand-400" />
                <span>💡 Tip: Type a word beside Search and tap Add with AI — meaning, example, and pronunciation are saved to the dictionary.</span>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center text-gray-500 gap-4 border border-dashed border-white/10 h-full min-h-[300px]">
              <BookOpen className="w-12 h-12 text-gray-600" />
              <div>
                <p className="text-sm leading-relaxed font-semibold mb-1">
                  No word selected
                </p>
                <p className="text-xs text-gray-500">
                  Click any word from the list to view detailed information
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}