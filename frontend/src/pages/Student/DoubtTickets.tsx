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
  FileText,
  User,
} from 'lucide-react';

export const DoubtTickets: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [activeDoubt, setActiveDoubt] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchDoubts = async () => {
    try {
      const res = await api.get('/doubts');
      setDoubts(res.data);
      if (res.data.length > 0 && !activeDoubt) {
        loadDoubtDetails(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoubtDetails = async (id: string) => {
    try {
      const res = await api.get(`/doubts/${id}`);
      setActiveDoubt(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !activeDoubt) return;
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('message', replyMessage);
      if (replyFile) formData.append('attachment', replyFile);

      const res = await api.post(`/doubts/${activeDoubt.id}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setActiveDoubt((prev: any) => ({
        ...prev,
        messages: [...(prev.messages || []), res.data],
      }));
      setReplyMessage('');
      setReplyFile(null);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Mentor Doubt Resolution Queue</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Private, direct 1-on-1 dialogue with your assigned course mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-700">
            Your Doubt Tickets ({doubts.length})
          </div>

          <div className="divide-y divide-zinc-100 overflow-y-auto flex-1">
            {doubts.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No doubts submitted yet. Submit a question from the Classroom tab!
              </div>
            ) : (
              doubts.map((d) => {
                const isSelected = activeDoubt?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => loadDoubtDetails(d.id)}
                    className={`w-full p-4 text-left transition flex flex-col space-y-1 cursor-pointer ${
                      isSelected ? 'bg-zinc-100 dark:bg-zinc-900 border-l-4 border-zinc-900 dark:border-white' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{d.course?.title}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-zinc-900 line-clamp-2">{d.title}</div>
                    <div className="text-[11px] text-zinc-400 flex justify-between pt-1">
                      <span>Mentor: {d.mentor?.name || 'Assigned Lecturer'}</span>
                      <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Conversation Thread */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
          {activeDoubt ? (
            <>
              {/* Thread Header */}
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{activeDoubt.course?.title}</div>
                  <h2 className="text-sm font-bold text-zinc-900 mt-0.5">{activeDoubt.title}</h2>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      activeDoubt.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeDoubt.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    Status: {activeDoubt.status}
                  </span>
                </div>
              </div>

              {/* Message Messages Stream */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {activeDoubt.messages?.map((msg: any) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] font-semibold text-zinc-400 mb-1">
                        {isMe ? 'You' : `${msg.sender?.name} (${msg.sender?.role})`} •{' '}
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          isMe
                            ? 'bg-black dark:bg-white text-white dark:text-black text-white rounded-br-none'
                            : 'bg-zinc-100 text-zinc-800 rounded-bl-none border border-zinc-200'
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
                                isMe ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'
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

              {/* Message Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-2">
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to the mentor..."
                    className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
                  <Paperclip className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                    className="text-xs file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-zinc-700 file:border-zinc-300 file:text-[11px]"
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400">
              Select a doubt ticket from the left to view the mentor conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
