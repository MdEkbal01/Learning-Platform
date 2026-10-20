import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, HelpCircle, Video, Plus, Calendar, Clock, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Faculty Portal</div>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Mentor Instructional Console</h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee assigned courses, resolve learner doubt escalations, and host live sessions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/mentor/doubts"
            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl transition"
          >
            Review Doubts ({data?.openDoubtsCount || 0})
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Live Class</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data?.assignedCoursesCount || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Assigned Courses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data?.totalStudents || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Active Students</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data?.openDoubtsCount || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Doubts</div>
          </div>
        </div>
      </div>

      {/* Assigned Courses Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Assigned Courses</h2>
        <div className="divide-y divide-slate-100">
          {data?.courses?.map((c: any) => (
            <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                  Status: {c.status}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{c.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {c._count?.enrolments || 0} enrolled students • {c.durationHours} credit hours
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/student/classroom/${c.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                >
                  Preview Classroom
                </Link>
                <Link
                  to="/mentor/doubts"
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition"
                >
                  View Doubts
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Scheduled Live Classes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Upcoming Live Masterclasses</h2>
        {data?.upcomingLiveClasses?.length === 0 ? (
          <p className="text-xs text-slate-400">No upcoming live sessions scheduled. Click above to schedule one.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data?.upcomingLiveClasses?.map((cls: any) => (
              <div key={cls.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{cls.title}</div>
                  <div className="text-slate-500">{cls.course?.title} • {new Date(cls.scheduledAt).toLocaleString()}</div>
                </div>
                <a
                  href={cls.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
                >
                  Launch Room
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Live Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Schedule Live Class</h3>

            <form onSubmit={handleCreateLiveClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {data?.courses?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="e.g. Architecture Deep-Dive & Code Review"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={classDesc}
                  onChange={(e) => setClassDesc(e.target.value)}
                  placeholder="Brief overview of discussion topics..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={classSchedule}
                  onChange={(e) => setClassSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Link (Jitsi / Zoom / Meet)</label>
                <input
                  type="url"
                  required
                  value={classMeetingUrl}
                  onChange={(e) => setClassMeetingUrl(e.target.value)}
                  placeholder="https://meet.jit.si/MyClassroom"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
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
