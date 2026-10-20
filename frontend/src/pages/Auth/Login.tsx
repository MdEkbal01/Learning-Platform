import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingState, setIsVerifyingState] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('reason') === 'inactivity';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(identifier, password);
      const role = data.user.role;

      setIsVerifyingState(true);

      setTimeout(() => {
        // Smart redirection based on role
        if (role === 'SUPER_ADMIN') navigate('/admin/dashboard');
        else if (role === 'MENTOR') navigate('/mentor/dashboard');
        else if (role === 'CONTENT_MANAGER') navigate('/content/courses');
        else if (role === 'FINANCE_SUPPORT') navigate('/finance/dashboard');
        else if (role === 'MODERATOR') navigate('/moderator/queue');
        else navigate('/student/dashboard');
      }, 1100);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || err.response?.data?.reason || 'Invalid email/mobile or password.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setIdentifier(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="vibrant" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Sign in to your learning dashboard or access your enrolled courses.
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Glassmorphic Card Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl py-8 px-5 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
          {isVerifyingState ? (
            /* CodeByGaurav signature circular verification state */
            <VerificationSpinner
              title="Signing In..."
              subtitle="Establishing cryptographically secure session."
              targetPercent={100}
              durationMs={1000}
            />
          ) : (
            <>
              {isExpired && (
                <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Your session expired after 2 hours of inactivity. Please sign in again.</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Email, Mobile or Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com or +1000..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </button>
              </form>

              {/* Quick Demo Pre-fill helper */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 text-center">
                  1-Click Demo Persona Credentials
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('student@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl text-left transition font-semibold"
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('mentor@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-xl text-left transition font-semibold"
                  >
                    👨‍🏫 Mentor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('content@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 rounded-xl text-left transition font-semibold"
                  >
                    ✍️ Content Mgr
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('finance@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl text-left transition font-semibold"
                  >
                    💳 Finance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('moderator@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 rounded-xl text-left transition font-semibold"
                  >
                    🛡️ Moderator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin@lms.local')}
                    className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 rounded-xl text-left transition font-semibold"
                  >
                    👑 Super Admin
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">Password: Password123!</p>
              </div>

              <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Create an account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
