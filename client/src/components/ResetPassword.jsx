import React, { useState } from 'react';
import axios from 'axios';
import { Lock, ArrowRight, Loader2, CheckCircle, GraduationCap } from 'lucide-react';

export default function ResetPassword({ token, onResetSuccess }) {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password: formData.password });
      setSuccess(res.data.message || 'Password has been successfully reset. Redirecting...');
      
      // Delay to show success message before redirecting to login
      setTimeout(() => {
        if (onResetSuccess) onResetSuccess();
        else window.location.href = '/';
      }, 3000);
    } catch (err) {
      const errData = err.response?.data;
      let errMsg = 'An error occurred. Please try again.';
      if (errData?.error) {
        if (typeof errData.error === 'string') errMsg = errData.error;
        else if (typeof errData.error === 'object' && errData.error.message) errMsg = errData.error.message;
      } else if (errData?.message) errMsg = errData.message;
      else if (err.message) errMsg = err.message;
      
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 text-gray-100 flex overflow-hidden font-sans flex-col justify-center items-center p-6">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-700/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-violet-400 rounded-xl shadow-lg shadow-brand-500/30">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-brand-300 bg-clip-text text-transparent">LUMINA</h1>
          <span className="text-xs text-brand-400 font-bold tracking-widest uppercase">AI English Coach</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-2xl w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-black text-white">Reset Password</h3>
          <p className="text-gray-400 text-sm mt-1">
            Please enter your new password below.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
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

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Reset Password
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-brand-400 hover:text-brand-300 font-bold">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
