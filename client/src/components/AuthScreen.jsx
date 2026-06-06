import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, User, ArrowRight, Loader2,
  GraduationCap, MessageSquare, BookOpen,
  Target, Zap, Trophy, CheckCircle, Star
} from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-5 h-5 text-violet-400" />,
    color: 'bg-violet-500/15 border-violet-500/20',
    title: 'AI Conversation Coach',
    desc: 'Practice real English conversations with an AI tutor that corrects your grammar, pronunciation, and vocabulary in real-time.',
  },
  {
    icon: <Target className="w-5 h-5 text-blue-400" />,
    color: 'bg-blue-500/15 border-blue-500/20',
    title: 'IELTS Preparation',
    desc: 'Full IELTS mock tests for Listening, Reading, Writing and Speaking with band score estimates.',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    color: 'bg-emerald-500/15 border-emerald-500/20',
    title: '5,000+ Word Vocabulary Bank',
    desc: 'Master academic, business, and medical vocabulary with synonyms, antonyms, and usage examples.',
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    color: 'bg-amber-500/15 border-amber-500/20',
    title: 'Grammar A to Z',
    desc: 'Structured lessons from basic to advanced grammar, with interactive quizzes after each topic.',
  },
  {
    icon: <Trophy className="w-5 h-5 text-rose-400" />,
    color: 'bg-rose-500/15 border-rose-500/20',
    title: 'Daily Challenges & Streaks',
    desc: 'Stay motivated with daily writing and speaking challenges. Build your streak and boost your confidence.',
  },
  {
    icon: <Star className="w-5 h-5 text-cyan-400" />,
    color: 'bg-cyan-500/15 border-cyan-500/20',
    title: 'Personalized Progress',
    desc: 'Your own private dashboard tracks corrections, quiz scores, words learned, and IELTS band improvements.',
  },
];

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isForgotPassword) {
        const res = await axios.post('/api/auth/forgot-password', { email: formData.email });
        setSuccess(res.data.message || 'Password reset link sent.');
        // Don't clear email so user can see what they entered
      } else if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
        setSuccess('Account created! Please check your email for a verification link before logging in.');
        setTimeout(() => { setIsLogin(true); setSuccess(''); }, 5000);
      }
    } catch (err) {
      const errData = err.response?.data;
      let errMsg = 'An error occurred. Please try again.';
      if (errData?.error) {
        if (typeof errData.error === 'string') {
          errMsg = errData.error;
        } else if (typeof errData.error === 'object' && errData.error.message) {
          errMsg = errData.error.message;
        }
      } else if (errData?.message) {
        errMsg = errData.message;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 text-gray-100 flex overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-700/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* ─── Left Panel: Landing Info ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-violet-400 rounded-xl shadow-lg shadow-brand-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-brand-300 bg-clip-text text-transparent">LUMINA</h1>
            <span className="text-xs text-brand-400 font-bold tracking-widest uppercase">AI English Coach</span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="my-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" /> Powered by Google Gemini AI
          </div>
          <h2 className="text-4xl xl:text-5xl font-black leading-tight">
            Master English with{' '}
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-brand-300 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Coaching
          </h2>
          <p className="text-gray-400 text-lg mt-4 leading-relaxed max-w-lg">
            Get personalized feedback on your grammar, build your IELTS score, and practice fluent English conversations — all in one intelligent platform.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {['A','B','C','D'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 border-2 border-brand-900 flex items-center justify-center text-xs font-bold text-white">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">Join <span className="text-white font-bold">1,000+</span> learners improving their English every day</p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border bg-white/[0.03] ${f.color} backdrop-blur-sm`}>
              <div className={`p-2 rounded-lg ${f.color} shrink-0`}>{f.icon}</div>
              <div>
                <p className="font-bold text-white text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mt-8">
          {['✓ Free to start', '✓ No credit card required', '✓ Your data is private'].map((t, i) => (
            <span key={i} className="text-xs text-gray-500 font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Right Panel: Auth Form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-violet-400 rounded-xl shadow-lg shadow-brand-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-brand-300 bg-clip-text text-transparent">LUMINA</h1>
              <span className="text-xs text-brand-400 font-bold tracking-widest uppercase">AI English Coach</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* Tab Toggle */}
            <div className="flex bg-brand-900/60 rounded-2xl p-1 mb-8 border border-white/5">
              <button
                onClick={() => { setIsLogin(true); setIsForgotPassword(false); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin && !isForgotPassword ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setIsForgotPassword(false); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin && !isForgotPassword ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Create Account
              </button>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white">
                {isForgotPassword 
                  ? 'Reset Password 🔒'
                  : isLogin ? 'Welcome back 👋' : 'Start your journey 🚀'}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {isForgotPassword
                  ? 'Enter your email address and we will send you a link to reset your password.'
                  : isLogin
                    ? 'Enter your credentials to access your personalized dashboard.'
                    : 'Create your free account and begin improving your English today.'}
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start gap-2">
                <span className="mt-0.5">⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isForgotPassword && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                      placeholder="e.g. Shishir Rahman"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => { setIsForgotPassword(true); setError(''); setSuccess(''); }}
                        className="text-xs text-brand-400 hover:text-brand-300 font-bold transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="password" name="password" value={formData.password} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {!isLogin && !isForgotPassword && (
              <p className="text-xs text-gray-500 text-center mt-4">
                By creating an account, you agree to our{' '}
                <span className="text-brand-400 cursor-pointer hover:underline">Terms of Service</span>.
              </p>
            )}
          </div>

          {/* Mobile feature highlights */}
          <div className="mt-6 grid grid-cols-3 gap-3 lg:hidden">
            {[
              { icon: '🤖', label: 'AI Coach' },
              { icon: '📝', label: 'IELTS Prep' },
              { icon: '📚', label: '5K Words' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-xs text-gray-400 font-bold">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
