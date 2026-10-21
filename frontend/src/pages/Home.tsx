import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
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
      .then((res) => setFeaturedCourses(Array.isArray(res.data) ? res.data.slice(0, 3) : []))
      .catch(() => setFeaturedCourses([]));
  }, []);

  return (
    <div className="space-y-16 pb-16 bg-white dark:bg-black transition-colors duration-200">
      {/* Hero Section (Monochrome White / Black) */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Online Learning & Course Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-black dark:text-white">
            Enterprise-Grade Learning with{' '}
            <span className="underline decoration-zinc-400 dark:decoration-zinc-600">
              Verified Mastery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Discover cutting-edge courses, interact with dedicated mentors, track your progress with modular assessments, and earn verifiable cryptographic completion certificates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow-xs transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Explore Course Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/verify-certificate"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-semibold text-sm transition flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Verify a Certificate</span>
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Least-Privilege RBAC</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Scoped roles & privacy</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <CheckCircle className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Anti-Tamper Orders</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Server verified checkout</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Award className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Verifiable Credentials</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Instant code validation</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Video className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Live Classes & Doubts</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Direct mentor escalation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Featured Courses</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Master in-demand skills taught by experienced industry mentors.</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center space-x-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img
                  src={c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition transform hover:scale-105 duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-xs">
                  {c.category?.name}
                </div>
                {c.isFree ? (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                    FREE
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                    ${c.price}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-2 hover:underline transition">
                    <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">{c.shortDescription}</p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{c.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{c.enrolledCount} Enrolled</span>
                  </div>
                </div>

                <Link
                  to={`/courses/${c.slug}`}
                  className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-xs rounded-xl text-center border border-zinc-200 dark:border-zinc-700 transition block"
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
