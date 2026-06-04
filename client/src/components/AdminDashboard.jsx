import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Users, MessageSquare, BookOpen, Shield, Trash2, ChevronUp, ChevronDown,
  BarChart3, Award, CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap,
  Plus, Pencil, Search, X, Save, ChevronLeft, ChevronRight, Activity,
  Calendar, Flame, Eye
} from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, subtext }) => (
  <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${color} shrink-0`}>{icon}</div>
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-white mt-0.5">{value ?? '—'}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

// ── Word Form Modal ─────────────────────────────────────────────
const WordModal = ({ word, onClose, onSave }) => {
  const isEdit = !!word?._id;
  const [form, setForm] = useState({
    english: word?.english || '',
    bangla: word?.bangla || '',
    pronunciation: word?.pronunciation || '',
    partOfSpeech: word?.partOfSpeech || 'noun',
    example: word?.example || '',
    exampleBangla: word?.exampleBangla || '',
    category: word?.category || '',
    difficulty: word?.difficulty || 'beginner',
    synonyms: (word?.synonyms || []).join(', '),
    antonyms: (word?.antonyms || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        synonyms: form.synonyms.split(',').map(s => s.trim()).filter(Boolean),
        antonyms: form.antonyms.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await axios.put(`/api/admin/vocab/${word._id}`, payload);
      } else {
        await axios.post('/api/admin/vocab', payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save word.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm";
  const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            {isEdit ? <><Pencil className="w-5 h-5 text-brand-400" /> Edit Word</> : <><Plus className="w-5 h-5 text-emerald-400" /> Add New Word</>}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">⚠️ {error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>English Word *</label>
              <input name="english" value={form.english} onChange={handleChange} required className={inputCls} placeholder="e.g. Eloquent" />
            </div>
            <div>
              <label className={labelCls}>Bangla Meaning *</label>
              <input name="bangla" value={form.bangla} onChange={handleChange} required className={inputCls} placeholder="e.g. বাকপটু" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Pronunciation</label>
              <input name="pronunciation" value={form.pronunciation} onChange={handleChange} className={inputCls} placeholder="e.g. /ˈel.ə.kwənt/" />
            </div>
            <div>
              <label className={labelCls}>Part of Speech</label>
              <select name="partOfSpeech" value={form.partOfSpeech} onChange={handleChange} className={inputCls}>
                {['noun','verb','adjective','adverb','preposition','conjunction','interjection','pronoun','phrase','idiom'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category *</label>
              <input name="category" value={form.category} onChange={handleChange} required className={inputCls} placeholder="e.g. Academic, Business" />
            </div>
            <div>
              <label className={labelCls}>Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputCls}>
                {['beginner','intermediate','advanced'].map(d => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>English Example</label>
            <textarea name="example" value={form.example} onChange={handleChange} className={inputCls + " resize-none"} rows={2} placeholder="e.g. She gave an eloquent speech." />
          </div>

          <div>
            <label className={labelCls}>Bangla Example</label>
            <textarea name="exampleBangla" value={form.exampleBangla} onChange={handleChange} className={inputCls + " resize-none"} rows={2} placeholder="বাংলা উদাহরণ..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Synonyms (comma-separated)</label>
              <input name="synonyms" value={form.synonyms} onChange={handleChange} className={inputCls} placeholder="e.g. fluent, articulate" />
            </div>
            <div>
              <label className={labelCls}>Antonyms (comma-separated)</label>
              <input name="antonyms" value={form.antonyms} onChange={handleChange} className={inputCls} placeholder="e.g. inarticulate, silent" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white font-black flex items-center justify-center gap-2 hover:from-brand-500 hover:to-violet-500 transition-all disabled:opacity-60 text-sm">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Add Word'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── User Activity Modal ─────────────────────────────────────────
const UserActivityModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/admin/users/${user._id}/activity`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user activity');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [user._id]);

  const viewChat = async (sessionId) => {
    setSelectedSessionId(sessionId);
    setChatLoading(true);
    setChatSession(null);
    try {
      const res = await axios.get(`/api/admin/sessions/${sessionId}`);
      setChatSession(res.data);
    } catch (err) {
      // ignore
    } finally {
      setChatLoading(false);
    }
  };

  const backToSessions = () => {
    setSelectedSessionId(null);
    setChatSession(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-5xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" /> User Activity Monitor
            </h3>
            <p className="text-gray-400 text-sm font-semibold mt-1">Viewing: <span className="text-white">{user.name}</span> ({user.email})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-400 font-bold bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20">{error}</div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Panel: Progress Stats & Session List */}
            <div className={`w-full ${selectedSessionId ? 'hidden md:flex md:w-1/3' : 'flex md:w-1/3'} flex-col h-full border-r border-white/10 bg-brand-950/30`}>
              {/* Progress Overview */}
              <div className="p-5 border-b border-white/10 shrink-0">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Progress Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-gray-500 text-[10px] uppercase font-bold">Training Level</p>
                    <p className="text-white font-black text-lg mt-0.5 capitalize">{data?.progress?.level || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-gray-500 text-[10px] uppercase font-bold">Current Streak</p>
                    <p className="text-white font-black text-lg mt-0.5 flex items-center gap-1">
                      {data?.progress?.streak || 0} <Flame className="w-4 h-4 text-orange-500" />
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-gray-500 text-[10px] uppercase font-bold">Words Learned</p>
                    <p className="text-white font-black text-lg mt-0.5 text-amber-400">{data?.progress?.wordsLearned?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-gray-500 text-[10px] uppercase font-bold">Corrections</p>
                    <p className="text-white font-black text-lg mt-0.5 text-rose-400">{data?.progress?.correctionsCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-2">Chat Sessions ({data?.sessions?.length || 0})</h4>
                {data?.sessions?.map(sess => (
                  <button 
                    key={sess._id}
                    onClick={() => viewChat(sess._id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSessionId === sess._id ? 'bg-brand-600/20 border-brand-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <p className={`font-bold text-sm ${selectedSessionId === sess._id ? 'text-brand-300' : 'text-gray-200'} truncate`}>
                      {sess.title || 'Conversation'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sess.updatedAt).toLocaleDateString()}</span>
                      <span className="uppercase font-bold text-[10px] px-1.5 py-0.5 rounded bg-white/10">{sess.mode}</span>
                    </div>
                  </button>
                ))}
                {(!data?.sessions || data.sessions.length === 0) && (
                  <p className="text-center text-gray-500 text-sm py-4">No chat sessions found.</p>
                )}
              </div>
            </div>

            {/* Right Panel: Chat Transcript */}
            <div className={`w-full ${selectedSessionId ? 'flex' : 'hidden md:flex md:w-2/3'} flex-col h-full bg-[#0a0a0f]`}>
              {!selectedSessionId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-semibold">Select a chat session to read the transcript</p>
                </div>
              ) : chatLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
                </div>
              ) : chatSession ? (
                <>
                  <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0 bg-brand-950/50">
                    <button onClick={backToSessions} className="md:hidden p-2 rounded-lg bg-white/10 text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h4 className="font-bold text-white text-lg">{chatSession.title}</h4>
                      <p className="text-xs text-gray-400">Mode: <span className="uppercase text-brand-400">{chatSession.mode}</span> | Messages: {chatSession.messages.length}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatSession.messages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold shadow-lg ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-brand-500 text-white'}`}>
                          {msg.role === 'user' ? user.name?.charAt(0).toUpperCase() : 'AI'}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-violet-600/20 border border-violet-500/30 text-violet-50' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-red-400">
                  Failed to load session transcript.
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};


// ── Main Admin Dashboard ────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  // Vocabulary state
  const [vocabWords, setVocabWords] = useState([]);
  const [vocabTotal, setVocabTotal] = useState(0);
  const [vocabPage, setVocabPage] = useState(1);
  const [vocabTotalPages, setVocabTotalPages] = useState(1);
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabLoading, setVocabLoading] = useState(false);
  const [wordModal, setWordModal] = useState(null);
  const [deleteWordConfirm, setDeleteWordConfirm] = useState(null);

  // User Activity state
  const [activityUser, setActivityUser] = useState(null);

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3500); };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVocab = useCallback(async (page = 1, search = '') => {
    setVocabLoading(true);
    try {
      const res = await axios.get(`/api/admin/vocab?page=${page}&limit=15&search=${encodeURIComponent(search)}`);
      setVocabWords(res.data.words);
      setVocabTotal(res.data.total);
      setVocabPage(res.data.page);
      setVocabTotalPages(res.data.totalPages);
    } catch (err) {
      showMsg(`Error: ${err.response?.data?.error || 'Failed to fetch vocabulary'}`);
    } finally {
      setVocabLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (activeTab === 'vocab') fetchVocab(1, vocabSearch);
  }, [activeTab]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      showMsg(`Role updated to ${newRole} successfully!`);
    } catch (err) {
      showMsg(`Error: ${err.response?.data?.error || 'Failed to update role'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setDeleteConfirm(null);
      showMsg('User deleted successfully.');
    } catch (err) {
      showMsg(`Error: ${err.response?.data?.error || 'Failed to delete user'}`);
    }
  };

  const handleDeleteWord = async (wordId, english) => {
    try {
      await axios.delete(`/api/admin/vocab/${wordId}`);
      setVocabWords(prev => prev.filter(w => w._id !== wordId));
      setVocabTotal(t => t - 1);
      setDeleteWordConfirm(null);
      showMsg(`"${english}" deleted successfully.`);
    } catch (err) {
      showMsg(`Error: ${err.response?.data?.error || 'Failed to delete word'}`);
    }
  };

  const handleVocabSearch = (e) => {
    e.preventDefault();
    fetchVocab(1, vocabSearch);
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 font-bold text-lg">Access Denied</p>
        <p className="text-gray-400 text-sm mt-2">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Modals */}
      {wordModal !== null && (
        <WordModal
          word={wordModal}
          onClose={() => setWordModal(null)}
          onSave={() => { setWordModal(null); fetchVocab(vocabPage, vocabSearch); showMsg('Word saved successfully!'); }}
        />
      )}
      {activityUser && (
        <UserActivityModal user={activityUser} onClose={() => setActivityUser(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-brand-400" /> Admin Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage users, vocabulary, and monitor platform health.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all font-semibold text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Action Message */}
      {actionMsg && (
        <div className={`p-3 rounded-xl text-sm font-semibold ${actionMsg.startsWith('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
          {actionMsg}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-violet-400" />} label="Total Users" value={stats?.totalUsers} color="bg-violet-500/15" subtext={`${stats?.verifiedUsers} verified`} />
        <StatCard icon={<CheckCircle className="w-6 h-6 text-emerald-400" />} label="Verified Users" value={stats?.verifiedUsers} color="bg-emerald-500/15" subtext={`${(stats?.totalUsers || 0) - (stats?.verifiedUsers || 0)} pending`} />
        <StatCard icon={<MessageSquare className="w-6 h-6 text-blue-400" />} label="Chat Sessions" value={stats?.totalSessions} color="bg-blue-500/15" subtext="All time" />
        <StatCard icon={<BookOpen className="w-6 h-6 text-amber-400" />} label="Words Learned" value={stats?.totalWordsLearned} color="bg-amber-500/15" subtext="Platform-wide" />
        <StatCard icon={<Zap className="w-6 h-6 text-rose-400" />} label="Corrections Made" value={stats?.totalCorrections} color="bg-rose-500/15" subtext="AI grammar fixes" />
        <StatCard icon={<Award className="w-6 h-6 text-cyan-400" />} label="Quizzes Taken" value={stats?.totalQuizzesTaken} color="bg-cyan-500/15" subtext="Grammar quizzes" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-brand-900/60 rounded-2xl p-1 border border-white/5 w-fit">
        {[
          { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
          { id: 'vocab', label: 'Vocabulary Database', icon: <BookOpen className="w-4 h-4" /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Users Tab ─────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" /> Registered Users ({users.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-bold">User</th>
                  <th className="text-left px-5 py-3 font-bold">Status</th>
                  <th className="text-left px-5 py-3 font-bold">Role</th>
                  <th className="text-left px-5 py-3 font-bold">Joined</th>
                  <th className="text-right px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-violet-500 flex items-center justify-center font-extrabold text-white text-sm shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {user.isVerified
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"><CheckCircle className="w-3 h-3" />Verified</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold"><XCircle className="w-3 h-3" />Unverified</span>}
                    </td>
                    <td className="px-5 py-4">
                      {user.role === 'admin'
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold"><Shield className="w-3 h-3" />Admin</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-bold"><Users className="w-3 h-3" />User</span>}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setActivityUser(user)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Monitor
                        </button>

                        <button onClick={() => handleRoleChange(user._id, user.role)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${user.role === 'admin' ? 'bg-gray-500/10 border-gray-500/20 text-gray-400 hover:bg-gray-500/20' : 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20'}`}>
                          {user.role === 'admin' ? <span className="flex items-center gap-1"><ChevronDown className="w-3 h-3" />Demote</span> : <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" />Promote</span>}
                        </button>
                        
                        {deleteConfirm === user._id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDeleteUser(user._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">Confirm</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-500/10 border border-gray-500/20 text-gray-400 transition-all">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(user._id)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Vocabulary Tab ──────────────────────── */}
      {activeTab === 'vocab' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" /> Vocabulary Database ({vocabTotal.toLocaleString()} words)
            </h3>
            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleVocabSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={vocabSearch}
                    onChange={e => setVocabSearch(e.target.value)}
                    placeholder="Search words..."
                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 w-48"
                  />
                  {vocabSearch && <button type="button" onClick={() => { setVocabSearch(''); fetchVocab(1, ''); }} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-gray-500 hover:text-white" /></button>}
                </div>
                <button type="submit" className="px-3 py-2 bg-brand-600/50 border border-brand-500/30 rounded-xl text-brand-300 text-sm font-bold hover:bg-brand-600 transition-all">Search</button>
              </form>
              {/* Add Word */}
              <button onClick={() => setWordModal({})}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl text-white font-bold text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" /> Add Word
              </button>
            </div>
          </div>

          {vocabLoading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-bold">English</th>
                    <th className="text-left px-5 py-3 font-bold">Bangla</th>
                    <th className="text-left px-5 py-3 font-bold hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-3 font-bold hidden lg:table-cell">Part of Speech</th>
                    <th className="text-left px-5 py-3 font-bold hidden lg:table-cell">Difficulty</th>
                    <th className="text-right px-5 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vocabWords.map((word, idx) => (
                    <tr key={word._id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-bold text-white">{word.english}</p>
                          {word.pronunciation && <p className="text-gray-500 text-xs">{word.pronunciation}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{word.bangla}</td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">{word.category}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell capitalize">{word.partOfSpeech}</td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${word.difficulty === 'advanced' ? 'bg-red-500/10 text-red-400' : word.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {word.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setWordModal(word)} className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleteWordConfirm === word._id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDeleteWord(word._id, word.english)} className="px-2 py-1 rounded-lg text-xs font-bold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30">Confirm</button>
                              <button onClick={() => setDeleteWordConfirm(null)} className="px-2 py-1 rounded-lg text-xs font-bold bg-gray-500/10 text-gray-400">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteWordConfirm(word._id)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {vocabWords.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-500">No words found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {vocabTotalPages > 1 && (
            <div className="flex items-center justify-between p-5 border-t border-white/10">
              <p className="text-gray-500 text-xs">Page {vocabPage} of {vocabTotalPages} ({vocabTotal} words)</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { const p = vocabPage - 1; setVocabPage(p); fetchVocab(p, vocabSearch); }} disabled={vocabPage <= 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => { const p = vocabPage + 1; setVocabPage(p); fetchVocab(p, vocabSearch); }} disabled={vocabPage >= vocabTotalPages}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
