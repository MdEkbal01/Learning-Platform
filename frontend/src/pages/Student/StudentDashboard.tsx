import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PointerLight } from '../../components/PointerLight';
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
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get('/student/my-courses'),
      api.get('/student/live-classes'),
    ])
      .then(([coursesRes, liveRes]) => {
        setEnrolments(coursesRes.data);
        setLiveClasses(liveRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalCompletedLessons = enrolments.reduce(
    (acc, curr) => acc + (curr.progress?.completedLessons || 0),
    0
  );

  const totalPossibleLessons = enrolments.reduce(
    (acc, curr) => acc + (curr.progress?.totalLessons || 0),
    0
  );

  const overallPercent = totalPossibleLessons > 0
    ? Math.round((totalCompletedLessons / totalPossibleLessons) * 100)
    : 0;

  // Study hours distribution across the week (visual metric)
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, percent: 65 },
    { day: 'Tue', hours: 3.8, percent: 90 },
    { day: 'Wed', hours: 1.5, percent: 40 },
    { day: 'Thu', hours: 4.2, percent: 100 },
    { day: 'Fri', hours: 2.0, percent: 50 },
    { day: 'Sat', hours: 3.5, percent: 85 },
    { day: 'Sun', hours: 1.0, percent: 25 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* CodeByGaurav signature ambient pointer glow */}
      <PointerLight intensity="subtle" />

      {/* Welcome Banner with Glassmorphic Gradient */}
      <div className="relative rounded-3xl p-8 text-white shadow-xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-widest text-blue-200 font-extrabold bg-blue-500/30 px-3 py-1 rounded-full border border-blue-400/30">
                Student Learning Portal
              </span>
              <span className="flex items-center text-xs text-amber-300 font-bold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                <Flame className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                5-Day Active Streak
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              {user?.profile?.college
                ? `${user.profile.college} • ${user.profile.academicCourse || 'Engineering'}`
                : 'Track your modular assessments, master recorded lectures, and earn verifiable credentials.'}
            </p>
          </div>

          {/* Quick Overall Mastery Gauge */}
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center space-x-4 shrink-0 shadow-inner">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - overallPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-sm font-black font-mono">{overallPercent}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Overall Mastery</div>
              <div className="text-[11px] text-blue-200">
                {totalCompletedLessons} of {totalPossibleLessons} Lessons
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar with Subtle Elevation & Hover Lift */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{enrolments.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Enrolments</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalCompletedLessons}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Lessons Mastered</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {enrolments.filter((e) => e.progress?.completionPercentage === 100).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Certificates Earned</div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{liveClasses.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Live Masterclasses</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses (2/3) + Visual Study Activity (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Enrolled Courses List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Enrolled Courses & Curricula</span>
            </h2>
            <Link
              to="/courses"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enrolments.length === 0 ? (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                You are not enrolled in any courses yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explore foundational engineering programs, data pipelines, and full-stack modules.
              </p>
              <Link
                to="/courses"
                className="inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Browse Course Catalogue
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolments.map((enr) => {
                const progress = enr.progress;
                const percent = progress?.completionPercentage || 0;
                return (
                  <div
                    key={enr.enrolmentId}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Thumbnail and Course Info */}
                      <div className="flex items-start space-x-4">
                        <img
                          src={enr.course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                          alt={enr.course.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs"
                        />
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                            {enr.course.category}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1 line-clamp-1">
                            {enr.course.title}
                          </h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-3">
                            <span>Instructor: {enr.course.instructorName}</span>
                            <span>•</span>
                            <span>{progress?.completedLessons || 0} / {progress?.totalLessons || 0} Lessons</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Circular Progress Ring & Action */}
                      <div className="flex items-center space-x-4 self-end sm:self-center">
                        {/* Circular Progress Gauge */}
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="19"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-slate-100 dark:text-slate-800"
                              fill="transparent"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="19"
                              stroke={percent === 100 ? '#10b981' : '#3b82f6'}
                              strokeWidth="4"
                              strokeDasharray={2 * Math.PI * 19}
                              strokeDashoffset={2 * Math.PI * 19 * (1 - percent / 100)}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-all duration-500"
                            />
                          </svg>
                          <span className="absolute text-[11px] font-bold font-mono text-slate-800 dark:text-white">
                            {percent}%
                          </span>
                        </div>

                        <Link
                          to={`/student/classroom/${enr.course.id}`}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 shrink-0"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Gradient Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          percent === 100
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
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

        {/* Right: Visual Weekly Learning Activity & Milestones */}
        <div className="space-y-6">
          {/* Weekly Activity Bar Chart */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Weekly Study Activity</span>
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                +18.5 hrs
              </span>
            </div>

            {/* Visual SVG / HTML Bar Columns */}
            <div className="h-36 flex items-end justify-between pt-4 gap-2">
              {weeklyActivity.map((w) => (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {w.hours}h
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-indigo-100 dark:bg-indigo-950/40 group-hover:bg-indigo-500 transition-all duration-300 relative overflow-hidden"
                    style={{ height: `${w.percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg opacity-80" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {w.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Daily Goal: 2 hrs</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Achieved ✓</span>
            </div>
          </div>

          {/* Upcoming Live Classes Card */}
          {liveClasses.length > 0 && (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Masterclasses
                </h3>
              </div>

              <div className="space-y-3">
                {liveClasses.slice(0, 3).map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {cls.course.title}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">
                      {cls.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(cls.scheduledAt).toLocaleDateString()}</span>
                      </span>
                      <a
                        href={cls.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition"
                      >
                        Join Room
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
