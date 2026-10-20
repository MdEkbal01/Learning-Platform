import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { OtpInputBoxes } from '../../components/OtpInputBoxes';
import { VerificationSpinner } from '../../components/VerificationSpinner';
import { Lock, Mail, User, Phone, BookOpen, AlertCircle, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';

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

  const [demoVerificationCode, setDemoVerificationCode] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await register(formData);
      setDemoVerificationCode(data.demoVerificationCode || '');
      setEnteredOtp(data.demoVerificationCode || '');
      setStep('VERIFY_OTP');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check inputs.');
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

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {step === 'REGISTER'
            ? 'Create your Student Account'
            : step === 'VERIFY_OTP'
            ? 'Verify Contact Details'
            : 'Secure Vault Verification'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {step === 'REGISTER'
            ? 'Join our accredited course catalogue and track your certifications.'
            : step === 'VERIFY_OTP'
            ? `Enter the 6-digit verification code sent to ${formData.email}`
            : 'Validating identity token and cryptographic session signature.'}
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Glassmorphic Card Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Password (8+ chars) *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Academic Profile */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Academic Affiliation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      College / Institute
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. IIT Delhi"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Academic Year
                    </label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
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
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      name="academicCourse"
                      value={formData.academicCourse}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <span>Continue to Security Verification</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>
            </form>
          ) : step === 'VERIFY_OTP' ? (
            /* CodeByGaurav Secure Vault Access OTP Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs text-blue-900 dark:text-blue-300 flex items-start space-x-3">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Security Challenge Initiated</div>
                  <p className="mt-1">
                    Single-use verification code generated. For demo convenience, the code is:{' '}
                    <span className="font-mono font-extrabold text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-blue-300 dark:border-blue-700">
                      {demoVerificationCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* 6-Digit Individual Boxed PIN Input */}
              <div className="space-y-3">
                <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Enter 6-Digit Verification PIN
                </label>
                <OtpInputBoxes
                  length={6}
                  value={enteredOtp}
                  onChange={(val) => setEnteredOtp(val)}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span>Verify Credentials & Sign In</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('REGISTER')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  ← Edit Information
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Resent code: ${demoVerificationCode}`)}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Didn't receive it? Resend
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

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
