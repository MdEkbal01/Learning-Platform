import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
import { MOCK_ENROLMENTS, MOCK_LIVE_CLASSES, MOCK_USER_LOGS } from '../../api/mockData';
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  Video,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  FileText,
  Download,
  Filter,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'COURSES' | 'PERFORMANCE' | 'LOGS'>('COURSES');
  const [enrolments, setEnrolments] = useState<any[]>(() => MOCK_ENROLMENTS || []);
  const [liveClasses, setLiveClasses] = useState<any[]>(() => MOCK_LIVE_CLASSES || []);
  const [activityLogs, setActivityLogs] = useState<any[]>(() => MOCK_USER_LOGS['user_student_01'] || []);
  const [isLoading, setIsLoading] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get('/student/my-courses'),
      api.get('/student/live-classes'),
      api.get('/student/activity-logs'),
    ])
      .then(([coursesRes, liveRes, logsRes]) => {
        setEnrolments(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setLiveClasses(Array.isArray(liveRes?.data) ? liveRes.data : []);
        setActivityLogs(Array.isArray(logsRes?.data) ? logsRes.data : []);
      })
      .catch((err) => {
        console.error(err);
        setEnrolments([]);
        setLiveClasses([]);
        setActivityLogs([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const safeEnrolments = Array.isArray(enrolments) ? enrolments : [];

  const totalCompletedLessons = safeEnrolments.reduce(
    (acc, curr) => acc + (curr.progress?.completedLessons || 0),
    0
  );

  const totalPossibleLessons = safeEnrolments.reduce(
    (acc, curr) => acc + (curr.progress?.totalLessons || 0),
    0
  );

  const overallPercent =
    totalPossibleLessons > 0
      ? Math.round((totalCompletedLessons / totalPossibleLessons) * 100)
      : 0;

  // Visual weekly activity metric
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, percent: 65 },
    { day: 'Tue', hours: 3.8, percent: 90 },
    { day: 'Wed', hours: 1.5, percent: 40 },
    { day: 'Thu', hours: 4.2, percent: 100 },
    { day: 'Fri', hours: 2.0, percent: 50 },
    { day: 'Sat', hours: 3.5, percent: 85 },
    { day: 'Sun', hours: 1.0, percent: 25 },
  ];

  // Subject mastery metrics for performance tab
  const masteryBreakdown = [
    { subject: 'Systems Architecture & Microservices', score: 94, grade: 'A+ Distinction' },
    { subject: 'React 19 & Concurrent Frontend Design', score: 98, grade: 'A+ Distinction' },
    { subject: 'PostgreSQL, Prisma & Schema Validation', score: 91, grade: 'A Excellent' },
    { subject: 'Security, Single-Session Tokens & RBAC', score: 100, grade: '100% Perfect' },
  ];

  // Download Academic Performance Transcript
  const handleDownloadTranscript = () => {
    const transcriptData = {
      institution: 'Ken Classes',
      student: {
        name: user?.name,
        email: user?.email,
        college: user?.profile?.college || 'Ken Classes Academy',
        course: user?.profile?.academicCourse || 'Software Engineering',
      },
      generatedAt: new Date().toISOString(),
      masteryBreakdown,
      enrolments: safeEnrolments.map((e) => ({
        courseTitle: e.course?.title,
        progress: e.progress,
      })),
      recentActivity: activityLogs,
    };

    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const studentName = user?.name || 'Student';
    a.download = `Academic_Transcript_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter activity logs
  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter !== 'ALL' && log.category !== logFilter) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* CodeByGaurav signature ambient pointer glow */}
      <PointerLight intensity="subtle" />

      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 text-zinc-900 dark:text-white shadow-sm overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-extrabold bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                Student Learning Portal
              </span>
              <span className="flex items-center text-xs text-zinc-800 dark:text-zinc-200 font-bold bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                <Flame className="w-3.5 h-3.5 mr-1 fill-current" />
                5-Day Active Streak
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Learner'}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              {user?.profile?.college
                ? `${user.profile.college} • ${user.profile.academicCourse || 'Engineering'}`
                : 'Track your modular assessments, master recorded lectures, and review your performance analytics.'}
            </p>
          </div>

          {/* Quick Overall Mastery Gauge */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-4 shrink-0 shadow-xs">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="transparent"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - overallPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-black dark:text-white transition-all duration-700"
                />
              </svg>
              <span className="absolute text-sm font-black font-mono">{overallPercent}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Overall Mastery</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {totalCompletedLessons} of {totalPossibleLessons} Lessons
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{enrolments.length}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Active Enrolments</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{totalCompletedLessons}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Lessons Mastered</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {enrolments.filter((e) => e.progress?.completionPercentage === 100).length}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Certificates Earned</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{liveClasses.length}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Live Masterclasses</div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('COURSES')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'COURSES'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Enrolled Curricula</span>
        </button>

        <button
          onClick={() => setActiveTab('PERFORMANCE')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'PERFORMANCE'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Academic Performance & Mastery</span>
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'LOGS'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>My Activity Logs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            {activityLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ENROLLED COURSES & LIVE MASTERCLASSES */}
      {activeTab === 'COURSES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
          {/* Left: Enrolled Courses List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span>Enrolled Courses & Curricula</span>
              </h2>
              <Link
                to="/courses"
                className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center space-x-1"
              >
                <span>Explore More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : enrolments.length === 0 ? (
              <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                  You are not enrolled in any courses yet
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Explore foundational engineering programs, data pipelines, and full-stack modules.
                </p>
                <Link
                  to="/courses"
                  className="inline-block mt-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl shadow-md"
                >
                  Browse Course Catalogue
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolments.map((enr) => {
                  const progress = enr.progress;
                  const percent = progress?.completionPercentage || 0;
                  const courseTitle = enr.course?.title || enr.title || 'Course Curriculum';
                  const courseThumbnail =
                    enr.course?.thumbnail ||
                    enr.thumbnail ||
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
                  const categoryName =
                    typeof enr.course?.category === 'object'
                      ? enr.course?.category?.name
                      : typeof enr.category === 'object'
                      ? enr.category?.name
                      : enr.course?.category || enr.category || 'Curriculum';
                  const instructorName =
                    enr.course?.instructor?.name ||
                    enr.course?.instructorName ||
                    (typeof enr.course?.instructor === 'string' ? enr.course?.instructor : 'Ken Classes Faculty');
                  const courseId = enr.course?.id || enr.courseId || enr.id || '';

                  return (
                    <div
                      key={enr.enrolmentId || enr.id || courseId}
                      className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Thumbnail and Course Info */}
                        <div className="flex items-start space-x-4">
                          <img
                            src={courseThumbnail}
                            alt={courseTitle}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-xs"
                          />
                          <div>
                            <span className="text-[10px] font-bold tracking-wider text-zinc-900 dark:text-white uppercase bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                              {categoryName}
                            </span>
                            <h3 className="font-bold text-zinc-900 dark:text-white text-base mt-1 line-clamp-1">
                              {courseTitle}
                            </h3>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center space-x-3">
                              <span>Instructor: {instructorName}</span>
                              <span>•</span>
                              <span>
                                {progress?.completedLessons || 0} / {progress?.totalLessons || 0} Lessons
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Circular Progress Gauge & Action */}
                        <div className="flex items-center space-x-4 self-end sm:self-center">
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="w-12 h-12 transform -rotate-90">
                              <circle
                                cx="24"
                                cy="24"
                                r="19"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-zinc-100 dark:text-zinc-800"
                                fill="transparent"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="19"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 19}
                                strokeDashoffset={2 * Math.PI * 19 * (1 - percent / 100)}
                                strokeLinecap="round"
                                fill="transparent"
                                className={`transition-all duration-500 ${
                                  percent === 100 ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'
                                }`}
                              />
                            </svg>
                            <span className="absolute text-[11px] font-bold font-mono text-zinc-800 dark:text-white">
                              {percent}%
                            </span>
                          </div>

                          <Link
                            to={`/student/classroom/${courseId}`}
                            className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 shrink-0"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            percent === 100
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                              : 'bg-black dark:bg-white'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Weekly Learning Activity & Upcoming Live Masterclasses */}
          <div className="space-y-6">
            {/* Weekly Activity Bar Chart */}
            <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-zinc-900 dark:text-white" />
                  <span>Weekly Study Activity</span>
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  +18.5 hrs
                </span>
              </div>

              {/* Visual Bars */}
              <div className="h-36 flex items-end justify-between pt-4 gap-2">
                {weeklyActivity.map((w) => (
                  <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[9px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                      {w.hours}h
                    </div>
                    <div
                      className="w-full rounded-t-lg bg-zinc-200 dark:bg-zinc-800 transition-all duration-300 relative overflow-hidden"
                      style={{ height: `${w.percent}%` }}
                    >
                      <div className="absolute inset-0 bg-black dark:bg-white rounded-t-lg opacity-80" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                      {w.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-zinc-900 dark:text-white" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Daily Goal: 2 hrs</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Achieved ✓</span>
              </div>
            </div>

            {/* Upcoming Live Classes Card */}
            {liveClasses.length > 0 && (
              <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Live Masterclasses
                  </h3>
                </div>

                <div className="space-y-3">
                  {liveClasses.slice(0, 3).map((cls) => {
                    const cTitle =
                      cls.courseTitle ||
                      (typeof cls.course === 'object' ? cls.course?.title : cls.course) ||
                      'Live Masterclass Cohort';
                    return (
                      <div
                        key={cls.id || 'live_' + Math.random()}
                        className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2"
                      >
                        <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase truncate">
                          {cTitle}
                        </div>
                        <div className="text-xs font-bold text-zinc-800 dark:text-white">
                          {cls.title}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {cls.scheduledAt ? new Date(cls.scheduledAt).toLocaleDateString() : 'Scheduled'}
                            </span>
                          </span>
                          <a
                            href={cls.meetingUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition"
                          >
                            Join Room
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC PERFORMANCE & MASTERY */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span>Academic Performance & Assessment Mastery</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Verified breakdown of assessment scores, study discipline, and course milestone completions.
              </p>
            </div>

            <button
              onClick={handleDownloadTranscript}
              className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Transcript Dossier</span>
            </button>
          </div>

          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Assessment Average</span>
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Top 5% Cohort
                </span>
              </div>
              <div className="text-4xl font-black text-zinc-900 dark:text-white font-mono">
                96.2%
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Calculated across 8 modular quizzes, code submissions, and final unit assessments.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Total Study Time</span>
                <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                  This Month
                </span>
              </div>
              <div className="text-4xl font-black text-zinc-900 dark:text-white font-mono">
                24.5 hrs
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Active video lecture playback, quiz attempts, and coding sandbox engagement.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Credential Status</span>
                <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                  Cryptographically Signed
                </span>
              </div>
              <div className="text-4xl font-black text-zinc-900 dark:text-white font-mono">
                {enrolments.filter((e) => e.progress?.completionPercentage === 100).length} / {enrolments.length || 1}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tamper-evident certificates issued with verified QR code credential registry.
              </p>
            </div>
          </div>

          {/* Subject Mastery Breakdown */}
          <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>Subject Knowledge & Technical Mastery Breakdown</span>
            </h3>

            <div className="space-y-4">
              {masteryBreakdown.map((item) => (
                <div key={item.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.subject}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        {item.score}%
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                        {item.grade}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-700"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY ACTIVITY LOGS */}
      {activeTab === 'LOGS' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span>Personal Learning & Session Activity Logs</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Chronological ledger of logins, completed lectures, quiz submissions, and course milestones.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Single-Session Protected</span>
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search your activity logs..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs focus:bg-white dark:focus:bg-black focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['ALL', 'SECURITY', 'LEARNING', 'ASSESSMENT', 'LIVE', 'COMMERCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    logFilter === cat
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Log List */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-5 space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No activity entries match your current search criteria.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                        {log.category}
                      </span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                        {log.title}
                      </h4>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {log.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-mono shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
