import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { OtpInputBoxes } from '../../components/OtpInputBoxes';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import { sendOtpEmail, sendWelcomeEmail } from '../../services/emailService';
import { Lock, Mail, User, Phone, BookOpen, AlertCircle, ArrowRight, KeyRound, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Dispatch One-Time Password strictly via Ken Classes EmailJS to the user's real email
      await sendOtpEmail({
        toEmail: formData.email,
        toName: formData.name,
        otpCode: generatedOtp,
        purpose: 'REGISTRATION',
      });

      setStep('VERIFY_OTP');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('ken_classes_reg_otp', freshOtp);
      await sendOtpEmail({
        toEmail: formData.email,
        toName: formData.name,
        otpCode: freshOtp,
        purpose: 'REGISTRATION',
      });
      setResendStatus(`A fresh verification code was sent to ${formData.email}. Please check your inbox.`);
    } catch {
      setError('Failed to resend email code. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setStep('VERIFYING_ANIMATION');

    try {
      await verifyOtp(formData.email, enteredOtp);

      // Dispatch Welcome Email via Ken Classes EmailJS
      sendWelcomeEmail({
        toEmail: formData.email,
        toName: formData.name,
      }).catch(() => {});

      // Wait briefly for the satisfying circular verification ring animation to complete
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1400);
    } catch (err: any) {
      setStep('VERIFY_OTP');
      setError(err.response?.data?.error || 'Verification code failed or expired.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
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
        {/* Card Container */}
        <div className="bg-white dark:bg-black py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'REGISTER' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@university.edu"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Password & Confirm Password with View Password Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Password (8+ chars) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer"
                      title={showPassword ? 'Hide password' : 'View password'}
                      aria-label={showPassword ? 'Hide password' : 'View password'}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-3.5 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition outline-hidden ${
                        confirmPassword && confirmPassword !== formData.password
                          ? 'border-rose-400 dark:border-rose-600'
                          : confirmPassword && confirmPassword === formData.password
                          ? 'border-emerald-500'
                          : 'border-zinc-300 dark:border-zinc-800'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 absolute right-2.5 top-2.5 transition cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'View password'}
                      aria-label={showConfirmPassword ? 'Hide password' : 'View password'}
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
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. IIT Delhi"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Academic Year
                    </label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
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
                      value={formData.academicCourse}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <span>Continue to Security Verification</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>
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
                    Please check your inbox or spam folder. For your privacy and security, the code is only delivered to your verified email.
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
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span>Verify Credentials & Sign In</span>
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
                  disabled={isLoading}
                  className="text-zinc-900 dark:text-zinc-100 font-semibold underline hover:text-black dark:hover:text-white transition cursor-pointer"
                >
                  {isLoading ? 'Sending fresh code...' : "Didn't receive it? Resend to Email"}
                </button>
              </div>
            </form>
          ) : (
            /* CodeByGaurav signature circular verification state */
            <VerificationSpinner
              title="Verifying..."
              subtitle="Securely checking your credentials."
              targetPercent={100}
              durationMs={1300}
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
