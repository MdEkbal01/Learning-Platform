import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  HelpCircle,
  Video,
  ArrowRight,
  CheckCircle2,
  Calendar,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="text-xs uppercase tracking-widest text-blue-200 font-bold">Student Learning Portal</div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            {user?.profile?.college
              ? `${user.profile.college} • ${user.profile.academicCourse || 'Engineering'}`
              : 'Keep up your steady momentum across all enrolled syllabi.'}
          </p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{enrolments.length}</div>
            <div className="text-xs text-slate-500 font-medium">Active Enrolments</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCompletedLessons}</div>
            <div className="text-xs text-slate-500 font-medium">Lessons Mastered</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {enrolments.filter((e) => e.progress?.completionPercentage === 100).length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Certificates Earned</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{liveClasses.length}</div>
            <div className="text-xs text-slate-500 font-medium">Live Masterclasses</div>
          </div>
        </div>
      </div>

      {/* Main Enrolled Courses */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Enrolled Courses & Progress</h2>
          <Link to="/courses" className="text-xs font-semibold text-blue-600 hover:underline">
            Browse More Courses →
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : enrolments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You are not enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our course catalogue to discover free foundational modules and professional masterclasses.
            </p>
            <Link
              to="/courses"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolments.map((enr) => {
              const progress = enr.progress;
              const percent = progress?.completionPercentage || 0;
              return (
                <div
                  key={enr.enrolmentId}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                          {enr.course.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-2">
                          {enr.course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Instructor: {enr.course.instructorName}</p>
                      </div>
                      <img
                        src={enr.course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                        alt={enr.course.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Course Progress</span>
                        <span className={percent === 100 ? 'text-emerald-600' : 'text-blue-600'}>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {progress?.completedLessons || 0} of {progress?.totalLessons || 0} lessons completed
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/student/classroom/${enr.course.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Live Masterclasses */}
      {liveClasses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-900">Upcoming Live Masterclasses</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {liveClasses.map((cls) => (
              <div key={cls.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-blue-600">{cls.course.title}</div>
                  <div className="font-bold text-sm text-slate-800">{cls.title}</div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(cls.scheduledAt).toLocaleString()}</span>
                    </span>
                    <span>•</span>
                    <span>Instructor: {cls.mentor?.name}</span>
                  </div>
                </div>
                <a
                  href={cls.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl text-center shadow-xs transition shrink-0"
                >
                  Join Live Room
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
