import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Trash2, RotateCcw, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function ChatHistory({ onLoadSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sessions/history/default_user');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this session?')) return;
    
    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const groupedByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.updatedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-brand-850/40 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No chat history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByDate).map(([date, dateSessions]) => (
        <div key={date}>
          <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 px-2">
            {date}
          </h4>
          <div className="space-y-1">
            {dateSessions.map(session => (
              <button
                key={session._id}
                onClick={() => onLoadSession(session._id, session.mode)}
                className="w-full text-left p-3 rounded-xl bg-brand-850/40 hover:bg-brand-850/60 border border-white/5 hover:border-white/10 transition-all group flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-white truncate">{session.mode}</span>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      {session.messages.length} messages
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {session.messages.length > 0 
                      ? session.messages[session.messages.length - 1].content.substring(0, 50)
                      : 'Empty session'
                    }...
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(session._id, e)}
                    className="p-1.5 hover:bg-rose-600/20 rounded-lg text-gray-400 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
