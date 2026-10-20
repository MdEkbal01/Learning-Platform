import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  User,
  CheckCheck,
} from 'lucide-react';

export const MentorDoubts: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [replyText, setReplyText] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoubts = async () => {
    try {
      const res = await api.get(`/doubts?status=${filterStatus}`);
      setDoubts(res.data);
      if (res.data.length > 0 && (!selectedDoubt || !res.data.some((d: any) => d.id === selectedDoubt.id))) {
        loadDoubt(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoubt = async (id: string) => {
    try {
      const res = await api.get(`/doubts/${id}`);
      setSelectedDoubt(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [filterStatus]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedDoubt) return;
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('message', replyText);
      if (replyFile) formData.append('attachment', replyFile);

      const res = await api.post(`/doubts/${selectedDoubt.id}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSelectedDoubt((prev: any) => ({
        ...prev,
        status: prev.status === 'OPEN' ? 'IN_PROGRESS' : prev.status,
        messages: [...(prev.messages || []), res.data],
      }));
      setReplyText('');
      setReplyFile(null);
      fetchDoubts();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to send reply.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResolveDoubt = async () => {
    if (!selectedDoubt) return;
    try {
      await api.patch(`/doubts/${selectedDoubt.id}/status`, { status: 'RESOLVED' });
      setSelectedDoubt((p: any) => ({ ...p, status: 'RESOLVED' }));
      fetchDoubts();
    } catch (e: any) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Instructional Support</div>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Assigned Doubt Ticket Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Resolve student technical inquiries and provide architectural feedback.
          </p>
        </div>

        {/* Filter status buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === st ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[700px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            Tickets in Queue ({doubts.length})
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {doubts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No tickets matching this status.
              </div>
            ) : (
              doubts.map((d) => {
                const isSelected = selectedDoubt?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => loadDoubt(d.id)}
                    className={`w-full p-4 text-left transition flex flex-col space-y-1 cursor-pointer ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 line-clamp-1">{d.course?.title}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 line-clamp-2">{d.title}</div>
                    <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                      <span>Student: {d.student?.name}</span>
                      <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Conversation Pane */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
          {selectedDoubt ? (
            <>
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-600">
                    {selectedDoubt.course?.title} {selectedDoubt.lesson ? `• ${selectedDoubt.lesson.title}` : ''}
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 mt-0.5">{selectedDoubt.title}</h2>
                  <div className="text-[11px] text-slate-500">Student: {selectedDoubt.student?.name} ({selectedDoubt.student?.email})</div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedDoubt.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedDoubt.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedDoubt.status}
                  </span>

                  {selectedDoubt.status !== 'RESOLVED' && (
                    <button
                      onClick={handleResolveDoubt}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Stream */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {selectedDoubt.messages?.map((msg: any) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] font-semibold text-slate-400 mb-1">
                        {isMe ? 'You (Mentor)' : `${msg.sender?.name} (Student)`} •{' '}
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        {msg.attachmentUrl && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center space-x-1.5 font-bold underline ${
                                isMe ? 'text-white' : 'text-indigo-600'
                              }`}
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>{msg.attachmentName || 'View Attachment'}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Provide guidance or code corrections for the student..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <Paperclip className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                    className="text-xs file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-slate-700 file:border-slate-300 file:text-[11px]"
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select a doubt ticket to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
