import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { PointerLight } from '../components/PointerLight';
import { VerificationSpinner } from '../components/VerificationSpinner';
import { Award, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';

export const VerifyCertificate: React.FC = () => {
  const { code: paramCode } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const initialCode = paramCode || searchParams.get('code') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [certificate, setCertificate] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performVerification = (codeToVerify: string) => {
    if (!codeToVerify || codeToVerify.trim().length === 0) return;
    setIsLoading(true);
    setError(null);
    setCertificate(null);
    setHasSearched(true);

    api
      .get(`/verify-certificate/${codeToVerify.trim()}`)
      .then((res: any) => {
        setTimeout(() => {
          setCertificate(res.data);
          setIsLoading(false);
        }, 1100);
      })
      .catch((err: any) => {
        setTimeout(() => {
          setError(err.response?.data?.error || 'Certificate not found or cryptographic hash mismatch.');
          setIsLoading(false);
        }, 1100);
      });
  };

  useEffect(() => {
    if (initialCode) {
      performVerification(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchCode);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 relative overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      {/* Ambient pointer light */}
      <PointerLight intensity="vibrant" />

      <div className="relative z-10 text-center space-y-2">
        <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-3xl flex items-center justify-center mx-auto shadow-xs border border-zinc-200 dark:border-zinc-800">
          <Award className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Public Certificate Registry
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          Verify accredited student completion credentials, authenticity tokens, and course curricula in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="e.g. CERT-2026-A1B2C3D4"
            className="w-full px-4 py-3.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl text-sm font-mono tracking-wider text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent shadow-xs transition outline-hidden"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-4" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-7 py-3.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm rounded-2xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Scanning...' : 'Verify'}
        </button>
      </form>

      {/* Verification Spinner Display */}
      {isLoading && (
        <div className="relative z-10 max-w-md mx-auto bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <VerificationSpinner
            title="Verifying Authenticity..."
            subtitle="Querying server-side cryptographic ledger."
            targetPercent={100}
            durationMs={1100}
          />
        </div>
      )}

      {certificate && !isLoading && (
        <div className="relative z-10 max-w-2xl mx-auto bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-300 dark:border-zinc-700 shadow-2xl overflow-hidden animate-in fade-in duration-300">
          <div className="bg-black dark:bg-zinc-900 text-white px-6 py-3.5 flex items-center justify-between text-xs font-bold border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Official Verified Cryptographic Certificate</span>
            </div>
            <span className="font-mono bg-white/10 px-2.5 py-1 rounded-lg">{certificate.certificateCode}</span>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-md overflow-hidden">
              <img
                src="/logo.png"
                alt="Ken Classes Seal"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold">
                This certifies that
              </span>
              <div className="text-3xl font-black text-zinc-900 dark:text-white">
                {certificate.studentName}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                has successfully completed the comprehensive curriculum and modular grading for
              </span>
            </div>

            <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
                {certificate.courseTitle}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Instruction by {certificate.instructorName} • {certificate.durationHours} Credit Hours
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left text-xs border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <div>
                <span className="text-zinc-400 block text-[11px]">Date Issued:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {new Date(certificate.issuedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Accredited Registry:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  Ken Classes Academic Accreditation Board
                </span>
              </div>
            </div>

            {/* Authenticity Stamp */}
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>SHA-256 Signature Verified & Validated</span>
            </div>
          </div>
        </div>
      )}

      {error && hasSearched && !isLoading && (
        <div className="relative z-10 max-w-md mx-auto p-6 bg-white dark:bg-zinc-950 border border-rose-200 dark:border-rose-900 rounded-3xl shadow-lg text-center space-y-3">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-white">Invalid Certificate Code</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
          <p className="text-[11px] text-zinc-400">
            Please double-check the credential code or contact platform support.
          </p>
        </div>
      )}
    </div>
  );
};
