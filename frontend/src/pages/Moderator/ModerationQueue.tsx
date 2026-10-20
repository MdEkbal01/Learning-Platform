import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ShieldAlert,
  CheckCircle,
  EyeOff,
  Trash2,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-rose-600 tracking-wider">Trust & Safety</div>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Community Moderation Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Investigate flagged discussions, evaluate policy adherence, and take auditable disciplinary actions.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['PENDING', 'ACTION_TAKEN', 'DISMISSED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === st ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Moderation Queue is Clear</h3>
            <p className="text-xs text-slate-500">No reported content pending review.</p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {r.targetType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400">Report ID: {r.id.substring(0, 8)}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reported on {new Date(r.createdAt).toLocaleString()} by {r.reporter?.name}</span>
                </div>
              </div>

              {/* Reported Reason Box */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Report Reason:</strong> {r.reason}
                </div>
              </div>

              {/* Target Content Preview */}
              {r.targetContent ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Flagged Content Preview:</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {r.targetContent.title || 'Forum Reply'}
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{r.targetContent.content}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Author: {r.targetContent.author?.name} ({r.targetContent.author?.email})
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                  Target content has already been removed or does not exist.
                </div>
              )}

              {/* Resolution or Actions */}
              {r.status === 'PENDING' ? (
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenAction(r, 'DISMISS')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleOpenAction(r, 'HIDE_CONTENT')}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Content</span>
                  </button>
                  <button
                    onClick={() => handleOpenAction(r, 'REMOVE_CONTENT')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                  <span>Outcome: <strong>{r.status}</strong> by {r.resolvedBy?.name || 'Moderator'}</span>
                  <span>Notes: {r.resolutionNotes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Action Dialog */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Confirm Moderation Action</h3>
            <p className="text-xs text-slate-500">
              Selected Action: <strong className="text-slate-800">{modAction}</strong>. This decision will be logged to the platform audit trail.
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Moderator Resolution Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition"
                >
                  {isSubmitting ? 'Applying...' : 'Execute Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
