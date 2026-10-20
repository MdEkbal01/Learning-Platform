import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Video,
  ArrowRight,
  BookOpen,
  Users,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setFeaturedCourses(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Online Learning & Course Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Enterprise-Grade Learning with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Verified Mastery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Discover cutting-edge courses, interact with dedicated mentors, track your progress with modular assessments, and earn verifiable cryptographic completion certificates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Explore Course Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/verify-certificate"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verify a Certificate</span>
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-sm font-bold text-white">Least-Privilege RBAC</div>
              <div className="text-xs text-slate-400">Scoped roles & privacy</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Anti-Tamper Orders</div>
              <div className="text-xs text-slate-400">Server verified checkout</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Award className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white">Verifiable Credentials</div>
              <div className="text-xs text-slate-400">Instant code validation</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Video className="w-5 h-5 text-rose-400 mb-2" />
              <div className="text-sm font-bold text-white">Live Classes & Doubts</div>
              <div className="text-xs text-slate-400">Direct mentor escalation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Master in-demand skills taught by experienced industry mentors.</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                  alt={c.title}
                  className="w-full h-full object-cover transition transform hover:scale-105 duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-xs">
                  {c.category?.name}
                </div>
                {c.isFree ? (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                    FREE
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                    ${c.price}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition">
                    <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.shortDescription}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.enrolledCount} Enrolled</span>
                  </div>
                </div>

                <Link
                  to={`/courses/${c.slug}`}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl text-center border border-slate-200 hover:border-blue-200 transition block"
                >
                  View Curriculum & Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
