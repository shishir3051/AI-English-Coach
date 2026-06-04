import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmail({ token, onVerified }) {
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.error || 'Verification failed.');
      }
    };
    if (token) {
      doVerify();
    }
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-500/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 z-10 animate-fadeIn text-center shadow-2xl">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-brand-500 animate-spin mb-4" />
            <h2 className="text-2xl font-black text-white">Verifying Email...</h2>
            <p className="text-gray-400 mt-2">Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Email Verified!</h2>
            <p className="text-emerald-400 mt-2 mb-6">Your account has been successfully verified.</p>
            <button
              onClick={onVerified}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Verification Failed</h2>
            <p className="text-red-400 mt-2 mb-6">{errorMsg}</p>
            <button
              onClick={onVerified}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
