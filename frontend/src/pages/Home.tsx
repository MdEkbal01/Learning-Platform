import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { MOCK_COURSES } from '../api/mockData';
import {
  ShieldCheck,
  Award,
  Video,
  ArrowRight,
  BookOpen,
  Users,
  CheckCircle,
  Sparkles,
  Search,
  Bot,
  Flame,
  Trophy,
  Zap,
  Code,
  GraduationCap,
  Play,
  Lock,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>(() =>
    Array.isArray(MOCK_COURSES) ? MOCK_COURSES : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch(() => {
        // Fallback already populated by MOCK_COURSES
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category?.name) set.add(c.category.name);
    });
    return ['ALL', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        c.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="space-y-16 pb-20 bg-white dark:bg-black transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50/50 dark:from-zinc-950 dark:via-black dark:to-zinc-950/50 text-zinc-900 dark:text-zinc-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-xl overflow-hidden transform transition hover:scale-105 duration-300">
              <img
                src="/logo.png"
                alt="Ken Classes Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Next-Generation Online Learning & Course Commerce</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-black dark:text-white">
            Enterprise-Grade Learning with{' '}
            <span className="underline decoration-zinc-400 dark:decoration-zinc-600">
              Verified Mastery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Master engineering and cloud computing with Ken AI 24/7 study companion, live cohort mentorship, modular assessments, and tamper-proof cryptographic certificates.
          </p>

          {/* Instant Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto pt-2 flex items-center shadow-lg rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1.5 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition"
          >
            <div className="pl-3.5 text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms, React, system design, DevOps..."
              className="w-full px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs sm:text-sm shrink-0 transition"
            >
              Explore
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {cat === 'ALL' ? 'All Programs' : cat}
              </button>
            ))}
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Least-Privilege RBAC</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Scoped roles & privacy</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              <CheckCircle className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Anti-Tamper Orders</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Server verified checkout</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              <Award className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Verifiable Credentials</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Instant code validation</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              <Video className="w-5 h-5 text-zinc-800 dark:text-zinc-200 mb-2" />
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Live Classes & Doubts</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Direct mentor escalation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Feature Spotlight: Ken AI Tutor & Gamified Suite */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spotlight 1: Ken AI Tutor Companion */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 shadow-lg overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ken AI Companion 2.0</span>
                </span>
                <span className="text-xs text-zinc-400 font-mono">24/7 Real-Time</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Instant Concept Breakdown & Code Debugging
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Stuck on a tricky algorithm or architectural bug? Ken AI analyzes your lesson code, provides step-by-step intuition, and generates instant practice quizzes.
              </p>

              {/* Mini Interactive Demo Preview */}
              <div className="rounded-2xl p-4 bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-2">
                <div className="flex items-center space-x-2 text-zinc-400 text-[11px]">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Student: "Why use idempotency keys in checkout APIs?"</span>
                </div>
                <div className="text-zinc-200 pl-5 border-l-2 border-amber-500/60 text-[11px] leading-relaxed">
                  Ken AI: "Prevents double charges during network timeouts by caching identical request IDs at the server gateway..."
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/student/classroom/course_fullstack_ts"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs sm:text-sm transition shadow-xs"
              >
                <span>Launch Ken AI Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11px] text-zinc-400">Included in all courses</span>
            </div>
          </div>

          {/* Spotlight 2: Gamified Learning & Cryptographic Proof */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <Flame className="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400" />
                  <span>Gamified Progress Engine</span>
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Streak & Badges</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Maintain Your Streak & Earn Verifiable Badges
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Stay consistent with XP progression, 7-day streak visualizers, competitive cohort leaderboards, and tamper-proof cryptographic certificates.
              </p>

              {/* Gamification Progress Mock */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <div className="text-lg font-black text-amber-500 font-mono">1,850 XP</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">Level 4 Scholar</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <div className="text-lg font-black text-rose-500 font-mono">5 Days 🔥</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">Active Streak</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <div className="text-lg font-black text-emerald-500 font-mono">#3 Rank</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">Leaderboard</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/student/dashboard"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs sm:text-sm transition shadow-xs"
              >
                <span>View Learning Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/verify-certificate"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:underline flex items-center space-x-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Verify Credentials</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Curated Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Featured Programs
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Master verified engineering and cloud architectures taught by top industry mentors.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center space-x-1"
          >
            <span>View All Programs ({courses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No courses found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Try adjusting your search query or switching to "All Programs".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-xs">
                    {c.category?.name || 'General'}
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
                  {c.level && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      {c.level}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-2 group-hover:underline transition">
                      <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                      {c.shortDescription || c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{c.totalLessons || c.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 12} Lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{c.enrolledCount || 240}+ Enrolled</span>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${c.slug}`}
                    className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-xs rounded-xl text-center border border-zinc-200 dark:border-zinc-700 transition block cursor-pointer"
                  >
                    View Curriculum & Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Enterprise Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-zinc-900 text-white border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Next-Gen Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Built for High Performance, Security & Zero Hidden Costs
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Engineered with global Cloudflare edge caching, strict brute-force rate limiters, single-session token security, and verifiable QR cryptography.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm transition shadow-xs"
              >
                Create Free Account
              </Link>
              <Link
                to="/help"
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold text-sm transition"
              >
                Learn More in Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
