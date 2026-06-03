import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Trash2, ChevronLeft, Calendar, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';

const ITEMS_PER_PAGE = 9;

export default function ChatHistoryPage({ onLoadSession, onBack }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sessions/history/default_user?limit=200');
      const sorted = res.data
        .filter((s) => s.messages?.some((m) => m.role === 'user'))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setSessions(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    
    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Get the last user message from a session
  const getLastUserMessage = (session) => {
    if (!session.messages || session.messages.length === 0) return 'Empty session';
    
    // Find last message from user (not AI)
    for (let i = session.messages.length - 1; i >= 0; i--) {
      const msg = session.messages[i];
      if (msg.role === 'user' && msg.content) {
        return msg.content;
      }
    }
    
    // Fallback to last message
    return session.messages[session.messages.length - 1].content || 'Empty session';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModeColor = (mode) => {
    const colors = {
      'Beginner': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Intermediate': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Advanced': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'IELTS': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Kids': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      'Professional': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Fast Speaking': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[mode] || 'bg-brand-500/10 text-brand-400 border-brand-500/20';
  };

  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(s => s.mode.toLowerCase() === filter.toLowerCase());

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = filteredSessions.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const modesList = [...new Set(sessions.map(s => s.mode))];
  const totalMessages = sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full text-white">
      {/* Header */}
      <div className="shrink-0 backdrop-blur-xl bg-brand-900/80 border-b border-white/5 rounded-2xl mb-4">
        <div className="px-3 py-4 sm:px-4 sm:py-5">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 truncate">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-brand-400 shrink-0" />
                Chat History
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                {totalMessages} messages • {sessions.length} chats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 pb-2">
        {/* Filter Tabs */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-brand-850/40 text-gray-400 hover:bg-brand-850/60 border border-white/5'
            }`}
          >
            All ({sessions.length})
          </button>
          {modesList.map(mode => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === mode
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-850/40 text-gray-400 hover:bg-brand-850/60 border border-white/5'
              }`}
            >
              {mode} ({sessions.filter(s => s.mode === mode).length})
            </button>
          ))}
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-brand-850/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : paginatedSessions.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-gray-400 text-lg">No conversations found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSessions.map(session => (
                <div
                  key={session._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onLoadSession(session._id, session.mode)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLoadSession(session._id, session.mode);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all hover:scale-105 cursor-pointer text-left group relative overflow-hidden ${getModeColor(
                    session.mode
                  )} hover:shadow-lg hover:shadow-brand-500/20`}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-white to-transparent" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-extrabold text-sm mb-1">{session.mode}</h3>
                        <p className="text-xs opacity-70">{session.messages?.length || 0} messages</p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(session._id, e)}
                        className="p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-600/30 rounded-lg text-current hover:text-red-400"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Show last USER message */}
                    <div className="mb-3 p-2 bg-black/20 rounded-lg min-h-[3.5rem]">
                      <p className="text-xs line-clamp-3 leading-relaxed font-medium">
                        👤 You: {getLastUserMessage(session)}
                      </p>
                    </div>

                    <p className="text-[10px] opacity-70 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 pb-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/10 hover:border-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-brand-600 text-white'
                          : 'border border-white/10 text-gray-400 hover:border-brand-500/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/10 hover:border-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-gray-400 w-full text-center sm:w-auto sm:ml-4">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
