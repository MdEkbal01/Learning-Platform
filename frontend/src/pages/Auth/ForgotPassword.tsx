import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { PointerLight } from '../../components/PointerLight';
import { OtpInputBoxes } from '../../components/OtpInputBoxes';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import { sendOtpEmail } from '../../services/emailService';
import { Lock, Mail, KeyRound, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'REQUEST' | 'RESET' | 'VERIFYING_ANIMATION'>('REQUEST');

  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { identifier });
      setMessage(res.data.message);
      const resetCode = res.data.demoResetCode || Math.floor(100000 + Math.random() * 900000).toString();
      setDemoCode(resetCode);
      setCode(resetCode);

      // Dispatch One-Time Password via Ken Classes EmailJS
      sendOtpEmail({
        toEmail: identifier,
        otpCode: resetCode,
        purpose: 'PASSWORD_RESET',
      }).catch(() => {});

      setStep('RESET');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (code.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setStep('VERIFYING_ANIMATION');

    try {
      const res = await api.post('/auth/reset-password', {
        identifier,
        code,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1400);
    } catch (err: any) {
      setStep('RESET');
      setError(err.response?.data?.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-black transition-colors duration-200">
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {step === 'REQUEST'
            ? 'Enter your verified email or mobile to receive a single-use reset code.'
            : step === 'RESET'
            ? 'Enter the 6-digit verification PIN and your new password.'
            : 'Verifying identity credentials and updating security record.'}
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-black py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && step !== 'VERIFYING_ANIMATION' && (
            <div className="mb-4 p-3.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {step === 'REQUEST' ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Email or Mobile Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@lms.local"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
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
                    <span>Send Verification Challenge</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>
            </form>
          ) : step === 'RESET' ? (
            /* CodeByGaurav Secure Vault Access OTP Screen */
            <form onSubmit={handleReset} className="space-y-5">
              {demoCode && (
                <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs text-zinc-900 dark:text-zinc-100 flex items-start space-x-3">
                  <KeyRound className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Demo Single-Use PIN:</span>{' '}
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      {demoCode}
                    </span>
                  </div>
                </div>
              )}

              {/* 6-Digit Individual Boxed PIN Input */}
              <div className="space-y-2">
                <label className="block text-center text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Enter 6-Digit Code
                </label>
                <OtpInputBoxes
                  length={6}
                  value={code}
                  onChange={(val) => setCode(val)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  New Password (8+ characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'View password'}
                    aria-label={showNewPassword ? 'Hide password' : 'View password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span>Reset Password & Invalidate Sessions</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="w-full text-xs text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-center py-1 transition"
              >
                ← Back to Identifier
              </button>
            </form>
          ) : (
            /* CodeByGaurav signature circular verification state */
            <VerificationSpinner
              title="Updating Password..."
              subtitle="Validating identity token and renewing credentials."
              targetPercent={100}
              durationMs={1200}
            />
          )}

          <div className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            Remember your credentials?{' '}
            <Link to="/login" className="font-semibold text-zinc-900 dark:text-white underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
