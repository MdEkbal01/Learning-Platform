import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { OtpInputBoxes } from '../../components/OtpInputBoxes';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import { sendOtpEmail, sendWelcomeEmail } from '../../services/emailService';
import {
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  AlertCircle,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'REGISTER' | 'VERIFY_OTP' | 'VERIFYING_ANIMATION'>('REGISTER');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    college: '',
    academicYear: '1st Year',
    academicCourse: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enterprise Security & Rate Limiting State
  const [regLockoutRemaining, setRegLockoutRemaining] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);
  const [otpFailedAttempts, setOtpFailedAttempts] = useState<number>(0);
  const [otpLockoutRemaining, setOtpLockoutRemaining] = useState<number>(0);

  // Check persistent registration lockout state on mount
  useEffect(() => {
    const stored = localStorage.getItem('ken_register_lockout');
    if (stored) {
      try {
        const { lockedUntil } = JSON.parse(stored);
        const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
        if (diff > 0) {
          setRegLockoutRemaining(diff);
        } else {
          localStorage.removeItem('ken_register_lockout');
        }
      } catch {
        localStorage.removeItem('ken_register_lockout');
      }
    }
  }, []);

  // Cooldown countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      if (regLockoutRemaining > 0) {
        setRegLockoutRemaining((prev) => {
          if (prev <= 1) {
            localStorage.removeItem('ken_register_lockout');
            return 0;
          }
          return prev - 1;
        });
      }
      if (resendCooldown > 0) {
        setResendCooldown((prev) => prev - 1);
      }
      if (otpLockoutRemaining > 0) {
        setOtpLockoutRemaining((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [regLockoutRemaining, resendCooldown, otpLockoutRemaining]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regLockoutRemaining > 0) return;

    setError(null);
    setResendStatus(null);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match identically.');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('ken_classes_reg_otp', generatedOtp);
      setEnteredOtp('');

      // Advance to verification and start 60s resend cooldown
      setStep('VERIFY_OTP');
      setResendCooldown(60);
      setResendStatus(`Sending confidential 6-digit PIN to ${formData.email}...`);

      // Dispatch OTP via EmailJS to user's real email
      sendOtpEmail({
        toEmail: formData.email,
        toName: formData.name,
        otpCode: generatedOtp,
        purpose: 'REGISTRATION',
      })
        .then((res) => {
          if (res.success) {
            setResendStatus(`Verification PIN successfully delivered to ${formData.email}. Please check your inbox.`);
          }
        })
        .catch(() => {});
    } catch (err: any) {
      if (err.response?.status === 429) {
        const retryAfter = err.response?.data?.retryAfterSeconds || 3600;
        const lockedUntil = Date.now() + retryAfter * 1000;
        localStorage.setItem('ken_register_lockout', JSON.stringify({ lockedUntil }));
        setRegLockoutRemaining(retryAfter);
        setError(err.response?.data?.error || 'Registration rate limit exceeded. Please try again later.');
        return;
      }
      setError(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;

    if (resendCount >= 3) {
      setError('Maximum of 3 OTP code resends allowed per session. Please wait or verify the current code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('ken_classes_reg_otp', freshOtp);
      setResendCooldown(60);
      setResendCount((prev) => prev + 1);
      setResendStatus(`Dispatching fresh verification PIN to ${formData.email}...`);

      sendOtpEmail({
        toEmail: formData.email,
        toName: formData.name,
        otpCode: freshOtp,
        purpose: 'REGISTRATION',
      })
        .then((res) => {
          if (res.success) {
            setResendStatus(`A fresh verification PIN was delivered to ${formData.email}. Please check your inbox.`);
          }
        })
        .catch(() => {});
    } catch {
      setError('Failed to resend email code. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpLockoutRemaining > 0) return;

    setError(null);

    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setStep('VERIFYING_ANIMATION');

    try {
      await verifyOtp(formData.email, enteredOtp);

      // Dispatch Welcome Email via Ken Classes EmailJS in background
      sendWelcomeEmail({
        toEmail: formData.email,
        toName: formData.name,
      }).catch(() => {});

      setTimeout(() => {
        navigate('/student/dashboard', { replace: true });
      }, 350);
    } catch (err: any) {
      setStep('VERIFY_OTP');
      const newAttempts = otpFailedAttempts + 1;
      setOtpFailedAttempts(newAttempts);

      if (newAttempts >= 5 || err.response?.status === 429) {
        setOtpLockoutRemaining(600); // 10 minutes lockout
        setError('Security Lockout: 5 invalid verification attempts. OTP verification is temporarily locked for 10 minutes to protect your credentials.');
      } else {
        const remaining = 5 - newAttempts;
        setError(
          `${err.response?.data?.error || 'Invalid verification code.'} (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
        );
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <PointerLight intensity="vibrant" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg overflow-hidden transform transition hover:scale-105 duration-200">
          <img
            src="/logo.png"
            alt="Ken Classes Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {step === 'REGISTER'
            ? 'Create your Student Account'
            : step === 'VERIFY_OTP'
            ? 'Verify Contact Details'
            : 'Secure Vault Verification'}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {step === 'REGISTER'
            ? 'Join our accredited course catalogue and track your certifications.'
            : step === 'VERIFY_OTP'
            ? `Enter the 6-digit verification code sent to ${formData.email}`
            : 'Validating identity token and cryptographic session signature.'}
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-black py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          {/* Registration Rate Limiting Lockout Banner */}
          {regLockoutRemaining > 0 && (
            <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-rose-900 dark:text-rose-100">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Anti-Bot Registration Throttle Enforced</span>
              </div>
              <p className="leading-relaxed">
                To protect our platform against automated bot registrations and email bombing, account creation is temporarily paused on this browser.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-rose-200 dark:border-rose-900/60 font-mono font-bold">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cooldown Remaining:</span>
                </span>
                <span className="text-sm px-2 py-0.5 rounded-md bg-rose-200/70 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100">
                  {formatCooldown(regLockoutRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* OTP Verification Lockout Banner */}
          {otpLockoutRemaining > 0 && (
            <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-rose-900 dark:text-rose-100">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>OTP Verification Cooldown Enforced</span>
              </div>
              <p className="leading-relaxed">
                5 invalid verification attempts detected. To safeguard PIN integrity, verification is locked for 10 minutes.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-rose-200 dark:border-rose-900/60 font-mono font-bold">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Try Again In:</span>
                </span>
                <span className="text-sm px-2 py-0.5 rounded-md bg-rose-200/70 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100">
                  {formatCooldown(otpLockoutRemaining)}
                </span>
              </div>
            </div>
          )}

          {error && regLockoutRemaining === 0 && otpLockoutRemaining === 0 && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'REGISTER' ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      name="name"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      name="email"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="aarav@college.edu"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    disabled={regLockoutRemaining > 0 || isLoading}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Password (Min 8 Characters) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      name="password"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={regLockoutRemaining > 0}
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden disabled:opacity-50 ${
                        confirmPassword && confirmPassword !== formData.password
                          ? 'border-rose-400 dark:border-rose-600'
                          : confirmPassword && confirmPassword === formData.password
                          ? 'border-emerald-500'
                          : 'border-zinc-300 dark:border-zinc-800'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={regLockoutRemaining > 0}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <span className={`text-[10px] mt-1 block font-medium ${
                      confirmPassword === formData.password ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}>
                      {confirmPassword === formData.password ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </span>
                  )}
                </div>
              </div>

              {/* Academic Profile */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block mb-2">
                  Academic Affiliation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      College / Institute
                    </label>
                    <input
                      type="text"
                      name="college"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. IIT Delhi"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Academic Year
                    </label>
                    <select
                      name="academicYear"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden disabled:opacity-50"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Graduate">Postgraduate / Master</option>
                      <option value="Professional">Working Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      name="academicCourse"
                      disabled={regLockoutRemaining > 0 || isLoading}
                      value={formData.academicCourse}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || regLockoutRemaining > 0}
                className="w-full mt-4 flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                ) : regLockoutRemaining > 0 ? (
                  <span className="flex items-center space-x-1.5 text-rose-300 dark:text-rose-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Throttled ({formatCooldown(regLockoutRemaining)})</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <span>Continue to Security Verification</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>

              {/* Rate Limit Trust Badge */}
              <div className="pt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by Anti-Bot Rate Limiting (Max 5 Signups/Hour)</span>
              </div>
            </form>
          ) : step === 'VERIFY_OTP' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs text-zinc-900 dark:text-zinc-100 flex items-start space-x-3">
                <KeyRound className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Confidential Verification Code Sent</div>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    A single-use 6-digit verification code has been dispatched to{' '}
                    <span className="font-semibold text-zinc-900 dark:text-white">{formData.email}</span>.
                    Please check your inbox. For your privacy and security, the code is only delivered to your verified email.
                  </p>
                </div>
              </div>

              {resendStatus && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{resendStatus}</span>
                </div>
              )}

              {/* 6-Digit Individual Boxed PIN Input */}
              <div className="space-y-3">
                <label className="block text-center text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Enter 6-Digit Verification PIN From Email
                </label>
                <OtpInputBoxes
                  length={6}
                  value={enteredOtp}
                  onChange={(val) => setEnteredOtp(val)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpLockoutRemaining > 0}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLockoutRemaining > 0 ? (
                  <span className="flex items-center space-x-1.5 text-rose-300 dark:text-rose-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Locked ({formatCooldown(otpLockoutRemaining)})</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    <span>Verify Credentials & Sign In</span>
                  </span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('REGISTER')}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
                >
                  ← Edit Information
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCooldown > 0 || resendCount >= 3}
                  className="text-zinc-900 dark:text-zinc-100 font-semibold underline hover:text-black dark:hover:text-white transition cursor-pointer disabled:opacity-50 disabled:no-underline"
                >
                  {isLoading
                    ? 'Sending fresh code...'
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resendCount >= 3
                    ? 'Max resends reached'
                    : "Didn't receive it? Resend to Email"}
                </button>
              </div>

              {/* OTP Anti-Brute-Force Trust Badge */}
              <div className="pt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by 10-Minute PIN Brute-Force Rate Limiting</span>
              </div>
            </form>
          ) : (
            <VerificationSpinner
              title="Verifying..."
              subtitle="Securely checking your credentials."
              targetPercent={100}
              durationMs={300}
            />
          )}

          <div className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-zinc-900 dark:text-white underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
