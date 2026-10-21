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

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="vibrant" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to your learning dashboard or access your enrolled courses.
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-black py-8 px-5 shadow-xl rounded-3xl sm:px-10 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
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
                <div className="mb-4 p-3.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
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
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Email, Mobile or Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com or +1000..."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white underline">
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
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-black dark:text-white underline">
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
