import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import {
  LifeBuoy,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Star,
  Clock,
  Send,
  ShieldAlert,
  Tag,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface FaqArticle {
  id: string;
  category: string;
  questionEn: string;
  answerEn: string;
  questionHi: string;
  answerHi: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  createdAt: string;
  messages: Array<{
    id: string;
    senderId?: string;
    senderRole: string;
    message: string;
    createdAt: string;
    sender?: { name: string };
  }>;
}

export const HelpCenter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useThemeLanguage();

  const [activeTab, setActiveTab] = useState<'faqs' | 'tickets' | 'feedback'>('faqs');

  // FAQs State
  const [faqs, setFaqs] = useState<FaqArticle[]>([]);
  const [faqCategory, setFaqCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [faqLoading, setFaqLoading] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [ticketRating, setTicketRating] = useState(5);
  const [ticketFeedbackComment, setTicketFeedbackComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // New Ticket Modal / Form State
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('GENERAL');
  const [ticketPriority, setTicketPriority] = useState('MEDIUM');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [ticketCreating, setTicketCreating] = useState(false);
  const [ticketCreatedRef, setTicketCreatedRef] = useState<string | null>(null);

  // Feedback State
  const [courses, setCourses] = useState<any[]>([]);
  const [fbCategory, setFbCategory] = useState<'GENERAL' | 'SUGGESTION' | 'BUG_REPORT' | 'COURSE_FEEDBACK'>('GENERAL');
  const [fbCourseId, setFbCourseId] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbTitle, setFbTitle] = useState('');
  const [fbDescription, setFbDescription] = useState('');
  const [fbConsent, setFbConsent] = useState(true);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbSuccessRef, setFbSuccessRef] = useState<string | null>(null);

  // Load FAQs
  useEffect(() => {
    setFaqLoading(true);
    const params: any = {};
    if (faqCategory !== 'ALL') params.category = faqCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();

    api
      .get('/support/faqs', { params })
      .then((res) => setFaqs(res.data))
      .catch(() => setFaqs([]))
      .finally(() => setFaqLoading(false));
  }, [faqCategory, searchQuery]);

  // Load Tickets
  const loadTickets = async () => {
    if (!isAuthenticated) return;
    setTicketsLoading(true);
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data);
      if (selectedTicket) {
        const refreshed = res.data.find((t: SupportTicket) => t.id === selectedTicket.id);
        if (refreshed) setSelectedTicket(refreshed);
      }
    } catch {
      // Ignored
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      loadTickets();
    }
  }, [activeTab, isAuthenticated]);

  // Load Courses for feedback
  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketCreating(true);
    try {
      const res = await api.post('/support/tickets', {
        category: ticketCategory,
        priority: ticketPriority,
        subject: ticketSubject,
        description: ticketDescription,
        requesterName: user?.name || guestName,
        requesterEmail: user?.email || guestEmail,
      });

      setTicketCreatedRef(res.data.ticketNumber);
      setTicketSubject('');
      setTicketDescription('');
      if (isAuthenticated) loadTickets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit ticket');
    } finally {
      setTicketCreating(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setReplyLoading(true);
    try {
      await api.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: replyText.trim(),
      });
      setReplyText('');
      loadTickets();
      // Reload ticket detail
      const res = await api.get(`/support/tickets/${selectedTicket.id}`);
      setSelectedTicket(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send message');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleSubmitSatisfaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await api.post(`/support/tickets/${selectedTicket.id}/feedback`, {
        rating: ticketRating,
        comment: ticketFeedbackComment,
      });
      setRatingSubmitted(true);
      loadTickets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbConsent) {
      alert('Please check the consent notice to proceed.');
      return;
    }

    setFbLoading(true);
    try {
      const res = await api.post('/feedback', {
        category: fbCategory,
        courseId: fbCategory === 'COURSE_FEEDBACK' && fbCourseId ? fbCourseId : undefined,
        rating: fbRating,
        title: fbTitle,
        description: fbDescription,
      });

      setFbSuccessRef(res.data.referenceNumber);
      setFbTitle('');
      setFbDescription('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setFbLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">IN PROGRESS</span>;
      case 'WAITING_ON_USER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">WAITING ON YOU</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">CLOSED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
            <LifeBuoy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>{t('helpTitle')}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t('helpSubtitle')}
          </p>
        </div>

        <button
          onClick={() => {
            setTicketCreatedRef(null);
            setShowCreateTicketModal(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('contactSupport')}</span>
        </button>
      </div>

      {/* Account Recovery Notification Banner (SUP-06) */}
      {!isAuthenticated && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Locked out or forgot password?</strong> Use our verified identity recovery flow to securely regain access to your enrolled courses.
            </span>
          </div>
          <Link
            to="/forgot-password"
            className="inline-flex items-center space-x-1 font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
          >
            <span>{t('accountRecovery')}</span>
          </Link>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'faqs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t('faqsTitle')}</span>
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'tickets'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>{t('myTickets')}</span>
            {tickets.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {tickets.length}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'feedback'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('feedback')}</span>
        </button>
      </div>

      {/* TAB 1: SEARCHABLE BILINGUAL FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Search Bar & Categories */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchFaqs')}
                className="w-full pl-11 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { key: 'ALL', label: 'All Topics' },
                { key: 'ACCOUNT_LOGIN', label: 'Account & Login' },
                { key: 'COURSES_CONTENT', label: 'Courses & Content' },
                { key: 'PAYMENTS_REFUNDS', label: 'Payments & Receipts' },
                { key: 'CERTIFICATES', label: 'Certificates & Verification' },
                { key: 'TECHNICAL_ISSUES', label: 'Technical Issues' },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setFaqCategory(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    faqCategory === c.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {faqLoading ? (
              <div className="text-center py-10 text-xs text-slate-400">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                No matching FAQs found for your query. Try raising a support ticket!
              </div>
            ) : (
              faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                const question = language === 'hi' && faq.questionHi ? faq.questionHi : faq.questionEn;
                const answer = language === 'hi' && faq.answerHi ? faq.answerHi : faq.answerEn;

                return (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center space-x-3 pr-4">
                        <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {question}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/20">
                        {answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY TICKETS & CONVERSATION THREAD */}
      {activeTab === 'tickets' && isAuthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{t('myTickets')}</span>
              <button
                onClick={() => {
                  setTicketCreatedRef(null);
                  setShowCreateTicketModal(true);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                + New Ticket
              </button>
            </h3>

            {ticketsLoading ? (
              <div className="text-center py-6 text-xs text-slate-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                {t('noTicketsFound')}
              </div>
            ) : (
              tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`cursor-pointer p-4 rounded-xl border transition ${
                    selectedTicket?.id === tkt.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                      {tkt.ticketNumber}
                    </span>
                    {getStatusBadge(tkt.status)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {tkt.subject}
                  </h4>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center space-x-2">
                    <span>{tkt.category}</span>
                    <span>•</span>
                    <span>{new Date(tkt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Conversation Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {selectedTicket.ticketNumber}
                      </span>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Priority: {selectedTicket.priority}
                  </span>
                </div>

                {/* Initial Description */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Initial Inquiry
                  </div>
                  {selectedTicket.description}
                </div>

                {/* Message Thread */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('conversationThread')}
                  </h4>

                  {selectedTicket.messages?.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No replies yet.</div>
                  ) : (
                    selectedTicket.messages?.map((msg) => {
                      const isStaff = msg.senderRole !== 'STUDENT';
                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl text-xs space-y-1.5 ${
                            isStaff
                              ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900'
                              : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                              <span>{msg.sender?.name || (isStaff ? 'Academic Support' : 'You')}</span>
                              {isStaff && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                                  {t('staffBadge')}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Box (if ticket not closed) */}
                {selectedTicket.status !== 'CLOSED' && (
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('typeReplyPlaceholder')}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={replyLoading}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{replyLoading ? 'Sending...' : t('sendReply')}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Post-Resolution Satisfaction Rating (SUP-05) */}
                {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED') && (
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{t('rateSupportExperience')}</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t('rateSupportDesc')}
                        </p>
                      </div>

                      {ratingSubmitted || selectedTicket.satisfactionRating ? (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{t('ratingSubmittedSuccess')} (Rating: {selectedTicket.satisfactionRating || ticketRating} / 5 Stars)</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitSatisfaction} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setTicketRating(star)}
                                className="p-1 text-amber-400 hover:scale-110 transition"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= ticketRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                              {ticketRating} of 5 Stars
                            </span>
                          </div>

                          <input
                            type="text"
                            value={ticketFeedbackComment}
                            onChange={(e) => setTicketFeedbackComment(e.target.value)}
                            placeholder="Optional feedback about our resolution speed or clarity..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                          />

                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                          >
                            {t('submitRating')}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
                Select a ticket on the left to read messages and post follow-ups.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FEEDBACK & PLATFORM RATINGS (FDBK-01 to FDBK-05) */}
      {activeTab === 'feedback' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('feedbackTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('feedbackSubtitle')}
            </p>
          </div>

          {fbSuccessRef ? (
            <div className="mt-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('submitFeedbackSuccess')}
              </h3>
              <div className="text-base font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                {fbSuccessRef}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t('feedbackTimeline')}
              </p>
              <button
                type="button"
                onClick={() => setFbSuccessRef(null)}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="mt-6 space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('feedbackCategory')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'GENERAL', label: t('generalFeedback') },
                    { id: 'SUGGESTION', label: t('suggestion') },
                    { id: 'BUG_REPORT', label: t('bugReport') },
                    { id: 'COURSE_FEEDBACK', label: t('courseFeedback') },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFbCategory(cat.id as any)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition ${
                        fbCategory === cat.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Selector if Course Feedback */}
              {fbCategory === 'COURSE_FEEDBACK' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('selectCourseOptional')}
                  </label>
                  <select
                    value={fbCourseId}
                    onChange={(e) => setFbCourseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="">Select a Course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('ratingLabel')}
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFbRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= fbRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {fbRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('feedbackTitleLabel')}
                </label>
                <input
                  type="text"
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  placeholder={t('feedbackTitlePlaceholder')}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('feedbackDescLabel')}
                </label>
                <textarea
                  rows={4}
                  value={fbDescription}
                  onChange={(e) => setFbDescription(e.target.value)}
                  placeholder={t('feedbackDescPlaceholder')}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={fbConsent}
                  onChange={(e) => setFbConsent(e.target.checked)}
                  required
                  className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 border-slate-300 dark:border-slate-700 mt-0.5 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  {t('consentNotice')}
                </label>
              </div>

              <button
                type="submit"
                disabled={fbLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {fbLoading ? 'Submitting...' : t('submitFeedbackBtn')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t('createTicket')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateTicketModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {ticketCreatedRef ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('ticketSubmittedSuccess')}
                </h4>
                <div className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400">
                  {ticketCreatedRef}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('ticketResponseTimeline')}
                </p>
                <button
                  onClick={() => setShowCreateTicketModal(false)}
                  className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('category')}
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                    >
                      <option value="GENERAL">{t('ticketCategoryGeneral')}</option>
                      <option value="COURSE_ACCESS">{t('ticketCategoryCourse')}</option>
                      <option value="PAYMENTS">{t('ticketCategoryPayment')}</option>
                      <option value="TECHNICAL">{t('ticketCategoryTech')}</option>
                      <option value="CERTIFICATES">{t('ticketCategoryCert')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('priority')}
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                    >
                      <option value="LOW">{t('priorityLow')}</option>
                      <option value="MEDIUM">{t('priorityMedium')}</option>
                      <option value="HIGH">{t('priorityHigh')}</option>
                      <option value="URGENT">{t('priorityUrgent')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('subject')}
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of the issue..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('description')}
                  </label>
                  <textarea
                    rows={4}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide detailed information, error messages, or course titles..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTicketModal(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ticketCreating}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                  >
                    {ticketCreating ? 'Submitting...' : t('submitTicket')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
