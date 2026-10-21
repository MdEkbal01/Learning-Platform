import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { MOCK_COURSES, MOCK_CATEGORIES } from '../api/mockData';
import { Search, BookOpen, Users } from 'lucide-react';

export const Catalogue: React.FC = () => {
  const [allCourses, setAllCourses] = useState<any[]>(() => MOCK_COURSES || []);
  const [courses, setCourses] = useState<any[]>(() => MOCK_COURSES || []);
  const [categories, setCategories] = useState<any[]>(() => MOCK_CATEGORIES || []);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceType, setPriceType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    api.get('/categories')
      .then((res) => {
        if (isMounted) setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (isMounted) setCategories([]);
      });

    api.get('/courses')
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setAllCourses(data);
        setCourses(data);
      })
      .catch(() => {
        if (!isMounted) return;
        setAllCourses([]);
        setCourses([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (allCourses.length === 0) return;

    let filtered = [...allCourses];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (c) => c.category?.id === selectedCategory || c.category?.slug === selectedCategory
      );
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter((c) => c.level === selectedLevel);
    }
    if (priceType === 'free') {
      filtered = filtered.filter((c) => c.isFree);
    } else if (priceType === 'paid') {
      filtered = filtered.filter((c) => !c.isFree);
    }
    const q = searchTerm.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.instructor?.name?.toLowerCase().includes(q)
      );
    }
    setCourses(filtered);
  }, [allCourses, selectedCategory, selectedLevel, priceType, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white dark:bg-black transition-colors duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Course Catalogue</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore comprehensive engineering and data programs. Free foundational courses available.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, topic, or instructor..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white outline-hidden"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Price Tabs */}
          <div className="sm:col-span-4 flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setPriceType('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                priceType === 'all' ? 'bg-white dark:bg-black text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All Pricing
            </button>
            <button
              onClick={() => setPriceType('free')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                priceType === 'free' ? 'bg-white dark:bg-black text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              100% Free
            </button>
            <button
              onClick={() => setPriceType('paid')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                priceType === 'paid' ? 'bg-white dark:bg-black text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Paid Only
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat.name} ({cat.courseCount})
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No courses found matching your criteria</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try resetting the filters or modifying your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <img
                  src={c.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition transform hover:scale-105 duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-xs">
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
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-zinc-400 mb-1">
                    <span>{c.level}</span>
                    <span>•</span>
                    <span>{c.durationHours} Hours</span>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-2 hover:underline transition">
                    <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">{c.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{c.totalLessons} Lessons ({c.totalModules} Modules)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{c.enrolledCount} Enrolled</span>
                  </div>
                </div>

                <Link
                  to={`/courses/${c.slug}`}
                  className="w-full py-2.5 px-4 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs rounded-xl text-center transition block"
                >
                  View Details & Syllabus
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
