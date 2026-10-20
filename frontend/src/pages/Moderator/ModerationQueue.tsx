import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { PointerLight } from '../../components/PointerLight';
import {
  ShieldAlert,
  CheckCircle,
  EyeOff,
  Trash2,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ModerationQueue: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  // Resolution modal
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modAction, setModAction] = useState<'DISMISS' | 'HIDE_CONTENT' | 'REMOVE_CONTENT'>('HIDE_CONTENT');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/moderator/queue?status=${statusFilter}`);
      setReports(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleOpenAction = (report: any, action: 'DISMISS' | 'HIDE_CONTENT' | 'REMOVE_CONTENT') => {
    setSelectedReport(report);
    setModAction(action);
    setResolutionNotes(
      action === 'HIDE_CONTENT'
        ? 'Content violates community guidelines (spam/solicitation). Hidden from learner feed.'
        : action === 'DISMISS'
        ? 'Report reviewed; content deemed compliant.'
        : 'Spam/abusive content permanently expunged.'
    );
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setIsSubmitting(true);

    try {
      await api.post(`/moderator/reports/${selectedReport.id}/action`, {
        action: modAction,
        resolutionNotes,
      });
      setSelectedReport(null);
      fetchReports();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="subtle" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-extrabold text-rose-600 dark:text-rose-400 tracking-wider bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
              Trust & Safety
            </span>
            <span className="flex items-center text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              Triage Mode
            </span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tight">
            Community Moderation Queue
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Investigate flagged discussions, evaluate policy adherence, and take auditable disciplinary actions.
          </p>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-semibold">
          {['PENDING', 'ACTION_TAKEN', 'DISMISSED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-zinc-800 text-rose-800 dark:text-rose-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="relative z-10 space-y-4">
        {reports.length === 0 ? (
          <div className="p-12 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-zinc-800 dark:text-white text-sm">
              Moderation Queue is Clear
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No reported content pending review across platform forums.
            </p>
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-4 transition duration-300 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {r.targetType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Report ID: {r.id.substring(0, 8)}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Reported on {new Date(r.createdAt).toLocaleString()} by {r.reporter?.name}
                  </span>
                </div>
              </div>

              {/* Reported Reason Box */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Report Reason:</strong> {r.reason}
                </div>
              </div>

              {/* Target Content Preview */}
              {r.targetContent ? (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Flagged Content Preview:
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-white text-sm">
                    {r.targetContent.title || 'Forum Discussion Post'}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {r.targetContent.content}
                  </p>
                  <div className="text-[11px] text-zinc-400 pt-1">
                    Author: {r.targetContent.author?.name} ({r.targetContent.author?.email})
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl text-xs text-zinc-400 italic">
                  Target content has already been removed or does not exist.
                </div>
              )}

              {/* Resolution or Actions */}
              {r.status === 'PENDING' ? (
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => handleOpenAction(r, 'DISMISS')}
                    className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl transition"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleOpenAction(r, 'HIDE_CONTENT')}
                    className="px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Content</span>
                  </button>
                  <button
                    onClick={() => handleOpenAction(r, 'REMOVE_CONTENT')}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between items-center">
                  <span>
                    Resolution: <strong className="text-zinc-800 dark:text-zinc-200">{r.status}</strong>
                  </span>
                  {r.resolutionNotes && <span>Note: {r.resolutionNotes}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Confirm Moderation Action: {modAction}
            </h3>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Apply disciplinary action to report ID{' '}
              <strong className="text-zinc-900 dark:text-white font-mono">
                {selectedReport.id.substring(0, 8)}
              </strong>
              . This event will be permanently recorded in the security audit trail.
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Mandatory Disciplinary Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Applying...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
