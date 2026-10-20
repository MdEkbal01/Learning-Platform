import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Award, CheckCircle2, XCircle, Search } from 'lucide-react';

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

    api.get(`/verify-certificate/${codeToVerify.trim()}`)
      .then((res: any) => {
        setCertificate(res.data);
      })
      .catch((err: any) => {
        setError(err.response?.data?.error || 'Certificate not found or invalid.');
      })
      .finally(() => setIsLoading(false));
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Award className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Certificate Registry
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Verify accredited student completion credentials, authenticity tokens, and course curricula in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="e.g. CERT-2026-A1B2C3D4"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {certificate && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-emerald-500 shadow-xl overflow-hidden animate-in fade-in">
          <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Verified Certificate</span>
            </div>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{certificate.certificateCode}</span>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">This certifies that</span>
              <div className="text-2xl font-black text-slate-900">{certificate.studentName}</div>
              <span className="text-xs text-slate-500 block">has successfully completed the comprehensive curriculum for</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-lg font-extrabold text-blue-900">{certificate.courseTitle}</div>
              <div className="text-xs text-slate-500 mt-1">
                Instruction by {certificate.instructorName} • {certificate.durationHours} Credit Hours
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left text-xs border-t border-slate-100 pt-6">
              <div>
                <span className="text-slate-400 block text-[11px]">Date Issued:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(certificate.issuedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Issuer:</span>
                <span className="font-semibold text-slate-800">AuraLMS Academic Accreditation Board</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && hasSearched && (
        <div className="max-w-md mx-auto p-6 bg-white border border-rose-200 rounded-2xl shadow-xs text-center space-y-3">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Invalid Certificate Code</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <p className="text-[11px] text-slate-400">
            Please double-check the code printed on the credential or ask the issuer to confirm.
          </p>
        </div>
      )}
    </div>
  );
};
