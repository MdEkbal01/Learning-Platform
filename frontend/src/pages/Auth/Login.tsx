import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingState, setIsVerifyingState] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('reason') === 'inactivity';

  // Initialize and check persistent rate-limiting lockout state
  useEffect(() => {
    const checkLockout = () => {
      const stored = localStorage.getItem('ken_login_lockout');
      if (stored) {
        try {
          const { lockedUntil } = JSON.parse(stored);
          const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
          if (diff > 0) {
            setLockoutRemaining(diff);
          } else {
            localStorage.removeItem('ken_login_lockout');
            setLockoutRemaining(0);
          }
        } catch {
          localStorage.removeItem('ken_login_lockout');
        }
      }
    };

    checkLockout();
  }, []);

  // Live countdown timer for rate limit cooldown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('ken_login_lockout');
          localStorage.removeItem('ken_login_failed_attempts');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      const data = await login(identifier, password);
      const role = data.user.role;

      // Reset failed attempts upon successful login
      localStorage.removeItem('ken_login_failed_attempts');
      localStorage.removeItem('ken_login_lockout');

      setIsVerifyingState(true);

      setTimeout(() => {
        // Smart instantaneous redirection based on role
        if (role === 'SUPER_ADMIN') navigate('/admin/dashboard', { replace: true });
        else if (role === 'MENTOR') navigate('/mentor/dashboard', { replace: true });
        else if (role === 'CONTENT_MANAGER') navigate('/content/courses', { replace: true });
        else if (role === 'FINANCE_SUPPORT') navigate('/finance/dashboard', { replace: true });
        else if (role === 'MODERATOR') navigate('/moderator/queue', { replace: true });
        else navigate('/student/dashboard', { replace: true });
      }, 250);
    } catch (err: any) {
      setIsLoading(false);

      // Check if server returned 429 Too Many Requests
      if (err.response?.status === 429) {
        const retryAfter = err.response?.data?.retryAfterSeconds || 900;
        const lockedUntil = Date.now() + retryAfter * 1000;
        localStorage.setItem('ken_login_lockout', JSON.stringify({ lockedUntil }));
        setLockoutRemaining(retryAfter);
        setError(err.response?.data?.error || 'Rate limit exceeded. Access is temporarily locked.');
        return;
      }

      // Track failed attempt count client-side (Max 5 attempts / 15 minutes)
      const prevAttempts = parseInt(localStorage.getItem('ken_login_failed_attempts') || '0', 10) + 1;
      localStorage.setItem('ken_login_failed_attempts', prevAttempts.toString());

      if (prevAttempts >= 5) {
        const lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lockout
        localStorage.setItem('ken_login_lockout', JSON.stringify({ lockedUntil }));
        setLockoutRemaining(900);
        setError('Security Lockout: 5 consecutive failed login attempts detected. To safeguard this account against unauthorized brute-force and credential-stuffing attacks, access is paused for 15 minutes.');
      } else {
        const remainingAttempts = 5 - prevAttempts;
        setError(
          `${err.response?.data?.error || 'Invalid email/mobile or password.'} (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before security lockout)`
        );
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient pointer light */}
      <PointerLight intensity="vibrant" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg overflow-hidden transform transition hover:scale-105 duration-200">
          <img
            src="/logo.png"
            alt="Ken Classes Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
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
            /* Fast circular verification state */
            <VerificationSpinner
              title="Signing In..."
              subtitle="Establishing cryptographically secure session."
              targetPercent={100}
              durationMs={250}
            />
          ) : (
            <>
              {/* Rate Limit Active Lockout Banner */}
              {lockoutRemaining > 0 && (
                <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center space-x-2 font-bold text-rose-900 dark:text-rose-100">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Security Rate Limit Enforced</span>
                  </div>
                  <p className="leading-relaxed">
                    Account authentication is temporarily locked to prevent unauthorized dictionary and credential-stuffing attacks.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-rose-200 dark:border-rose-900/60 font-mono font-bold">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cooldown Remaining:</span>
                    </span>
                    <span className="text-sm px-2 py-0.5 rounded-md bg-rose-200/70 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100">
                      {formatCooldown(lockoutRemaining)}
                    </span>
                  </div>
                </div>
              )}

              {isExpired && lockoutRemaining === 0 && (
                <div className="mb-4 p-3.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
                  <span>Your session expired after 2 hours of inactivity. Please sign in again.</span>
                </div>
              )}

              {error && lockoutRemaining === 0 && (
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
                      disabled={lockoutRemaining > 0 || isLoading}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com or +1000..."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={lockoutRemaining > 0 || isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={lockoutRemaining > 0}
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer disabled:opacity-50"
                      title={showPassword ? 'Hide password' : 'View password'}
                      aria-label={showPassword ? 'Hide password' : 'View password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || lockoutRemaining > 0}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  ) : lockoutRemaining > 0 ? (
                    <span className="flex items-center space-x-1.5 text-rose-300 dark:text-rose-700">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Locked ({formatCooldown(lockoutRemaining)})</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </button>
              </form>

              {/* Security Rate Limit Protection Trust Badge */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-center text-[10px] text-zinc-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by 15-Minute Brute-Force Rate Limiting (PRD AUTH-08)</span>
              </div>

              <div className="mt-4 text-center text-xs text-zinc-600 dark:text-zinc-400">
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
