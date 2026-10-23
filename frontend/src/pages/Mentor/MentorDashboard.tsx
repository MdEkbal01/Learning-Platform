import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { PointerLight } from '../../components/PointerLight';
import {
  Users,
  BookOpen,
  HelpCircle,
  Video,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  PlayCircle,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Sparkles,
  Info,
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
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

  // Publish Recording Modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedClassForPublish, setSelectedClassForPublish] = useState<any>(null);
  const [recordingVideoUrl, setRecordingVideoUrl] = useState('');
  const [targetModuleId, setTargetModuleId] = useState('');
  const [recordedLessonTitle, setRecordedLessonTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/mentor/dashboard');
      setData(res.data);
      const courses = res.data?.courses || res.data?.assignedCourses || [];
      if (courses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courses[0].id);
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

  const availableCourses = data?.courses || data?.assignedCourses || [];

  const handleGenerateInstantRoom = () => {
    const courseObj = availableCourses.find((c: any) => c.id === selectedCourseId);
    const slug = courseObj?.slug || 'lecture';
    const roomUrl = `https://meet.jit.si/KenClasses-${slug}-${Date.now().toString().slice(-6)}`;
    setClassMeetingUrl(roomUrl);
  };

  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseId = selectedCourseId || availableCourses[0]?.id;
    if (!courseId) {
      alert('Please select a course to schedule a live class for.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/mentor/live-classes', {
        courseId,
        title: classTitle,
        description: classDesc,
        scheduledAt: classSchedule || new Date(Date.now() + 3600000).toISOString(),
        meetingUrl: classMeetingUrl || `https://meet.jit.si/KenClasses-${Date.now().toString().slice(-6)}`,
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

  const openPublishModal = (cls: any) => {
    setSelectedClassForPublish(cls);
    setRecordedLessonTitle(`[Recorded Lecture] ${cls.title}`);
    setRecordingVideoUrl(cls.meetingUrl || '');
    const course = availableCourses.find((c: any) => c.id === cls.courseId) || cls.course;
    if (course?.modules?.length > 0) {
      setTargetModuleId(course.modules[0].id);
    }
    setShowPublishModal(true);
  };

  const handlePublishRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForPublish) return;
    setIsPublishing(true);
    try {
      const res = await api.post(`/mentor/live-classes/${selectedClassForPublish.id}/publish-recording`, {
        moduleId: targetModuleId,
        recordingVideoUrl,
        lessonTitle: recordedLessonTitle,
      });
      alert(res.data?.message || 'Recording published successfully into the course curriculum!');
      setShowPublishModal(false);
      setSelectedClassForPublish(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to publish recording.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative overflow-hidden">
      <PointerLight intensity="subtle" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-extrabold text-zinc-900 dark:text-white tracking-wider bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
              Faculty & Mentorship
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Instruction Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
            Faculty Workspace
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your courses, host live interactive sessions, resolve student tickets, and publish recordings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (availableCourses.length > 0 && !selectedCourseId) {
                setSelectedCourseId(availableCourses[0].id);
              }
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span>Schedule / Host Live Lecture</span>
          </button>
        </div>
      </div>

      {/* Educational Notice: How Live Class & Recording Works */}
      <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3 text-xs">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
          <div className="font-bold text-zinc-900 dark:text-white">How Live Lectures & Auto-Recording Work (100% Free):</div>
          <p>
            1. Click <strong>"Schedule / Host Live Lecture"</strong> and use <strong>"⚡ Generate Free Ken Room"</strong> for zero-setup video conferencing via Jitsi Meet.
          </p>
          <p>
            2. When in the meeting, you can stream to YouTube Live (Unlisted) or record to cloud/computer.
          </p>
          <p>
            3. Once the live lecture finishes, click <strong>"Publish Recording"</strong> on the class card to automatically add it as a permanent recorded lecture in the student classroom!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {availableCourses.length}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
              Available Courses
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {data?.totalStudents || 142}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
              Active Learners
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {data?.upcomingLiveClasses?.length || 0}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
              Live Masterclasses
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Roster */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Curriculum Roster</h2>
            <Link to="/content/courses" className="text-xs text-zinc-500 hover:text-black dark:hover:text-white font-bold flex items-center space-x-1">
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {availableCourses.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{c.title}</h3>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {c._count?.enrolments ?? 0} Enrolled Students • {c.level || 'Intermediate'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCourseId(c.id);
                      setShowModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition cursor-pointer"
                  >
                    Host Class
                  </button>
                  <Link
                    to={`/courses/${c.slug}`}
                    className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Live Masterclasses */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
              <Video className="w-4 h-4 text-rose-500" />
              <span>Live Masterclasses</span>
            </h2>
            <button
              onClick={() => {
                if (availableCourses.length > 0 && !selectedCourseId) {
                  setSelectedCourseId(availableCourses[0].id);
                }
                setShowModal(true);
              }}
              className="text-xs font-bold text-zinc-900 dark:text-white hover:underline cursor-pointer"
            >
              + New
            </button>
          </div>

          {data?.upcomingLiveClasses?.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">
              No live classes scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data?.upcomingLiveClasses?.map((cls: any) => (
                <div
                  key={cls.id}
                  className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {cls.course?.title || 'Program'}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      cls.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {cls.status || 'SCHEDULED'}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-zinc-800 dark:text-white">{cls.title}</div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(cls.scheduledAt).toLocaleDateString()}</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <a
                        href={cls.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition flex items-center space-x-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Launch</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => openPublishModal(cls)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[10px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                        title="Publish recording as a recorded lecture in curriculum"
                      >
                        <UploadCloud className="w-3 h-3" />
                        <span>Publish Recording</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Live Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Schedule Live Masterclass</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLiveClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden cursor-pointer"
                >
                  {availableCourses.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Live Coding Lab"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={classDesc}
                  onChange={(e) => setClassDesc(e.target.value)}
                  placeholder="Brief overview of live discussion topics..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={classSchedule}
                  onChange={(e) => setClassSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Meeting Link
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateInstantRoom}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>⚡ Generate Free Ken Room</span>
                  </button>
                </div>
                <input
                  type="url"
                  required
                  value={classMeetingUrl}
                  onChange={(e) => setClassMeetingUrl(e.target.value)}
                  placeholder="https://meet.jit.si/MyClassroom"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-mono text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Recording to Course Curriculum Modal */}
      {showPublishModal && selectedClassForPublish && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Publish Recording to Curriculum
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Convert this live masterclass into a permanent recorded lecture in the student classroom.
            </p>

            <form onSubmit={handlePublishRecording} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Recorded Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={recordedLessonTitle}
                  onChange={(e) => setRecordedLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Course Module
                </label>
                <select
                  value={targetModuleId}
                  onChange={(e) => setTargetModuleId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white outline-hidden cursor-pointer"
                >
                  {(availableCourses.find((c: any) => c.id === selectedClassForPublish.courseId)?.modules || []).map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Recorded Video Link (YouTube Unlisted, Zoom Cloud, Drive, Loom, Vimeo, MP4)
                </label>
                <input
                  type="url"
                  required
                  value={recordingVideoUrl}
                  onChange={(e) => setRecordingVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-mono text-zinc-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Student Classroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
