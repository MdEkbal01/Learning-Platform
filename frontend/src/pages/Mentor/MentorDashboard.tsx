import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import {
  BookOpen,
  Users,
  HelpCircle,
  Video,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Live Class Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classSchedule, setClassSchedule] = useState('');
  const [classMeetingUrl, setClassMeetingUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/mentor/dashboard');
      setData(res.data);
      if (res.data.courses?.length > 0) {
        setSelectedCourseId(res.data.courses[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/mentor/live-classes', {
        courseId: selectedCourseId,
        title: classTitle,
        description: classDesc,
        scheduledAt: classSchedule,
        meetingUrl: classMeetingUrl,
      });
      setShowModal(false);
      setClassTitle('');
      setClassDesc('');
      setClassSchedule('');
      setClassMeetingUrl('');
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to schedule live class.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="subtle" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Faculty & Mentorship
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Instruction Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Mentor Instructional Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Oversee assigned courses, resolve learner doubt escalations, and schedule live interactive masterclasses.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/mentor/doubts"
            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition shadow-xs"
          >
            Review Doubts ({data?.openDoubtsCount || 0})
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Live Class</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {data?.assignedCoursesCount || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Assigned Courses</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {data?.totalStudents || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Students</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {data?.openDoubtsCount || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Pending Doubts</div>
          </div>
        </div>
      </div>

      {/* Main Content: Assigned Courses (2/3) + Live Sessions (1/3) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Assigned Courses Roster */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Assigned Courses & Curricula</span>
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.courses?.map((c: any) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Status: {c.status}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{c.title}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {c._count?.enrolments || 0} enrolled students • {c.durationHours} credit hours
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/student/classroom/${c.id}`}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition"
                  >
                    Classroom
                  </Link>
                  <Link
                    to="/mentor/doubts"
                    className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition"
                  >
                    Doubts Queue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Live Masterclasses */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Video className="w-4 h-4 text-rose-500" />
              <span>Live Masterclasses</span>
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + New
            </button>
          </div>

          {data?.upcomingLiveClasses?.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No live classes scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data?.upcomingLiveClasses?.map((cls: any) => (
                <div
                  key={cls.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="font-bold text-xs text-slate-800 dark:text-white">{cls.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {cls.course?.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(cls.scheduledAt).toLocaleDateString()}</span>
                    </span>
                    <a
                      href={cls.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition"
                    >
                      Launch Room
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Live Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule Live Class</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLiveClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                >
                  {data?.courses?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="e.g. Architecture Deep-Dive & Code Review"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={classDesc}
                  onChange={(e) => setClassDesc(e.target.value)}
                  placeholder="Brief overview of discussion topics..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={classSchedule}
                  onChange={(e) => setClassSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Link (Jitsi / Zoom / Meet)
                </label>
                <input
                  type="url"
                  required
                  value={classMeetingUrl}
                  onChange={(e) => setClassMeetingUrl(e.target.value)}
                  placeholder="https://meet.jit.si/MyClassroom"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
