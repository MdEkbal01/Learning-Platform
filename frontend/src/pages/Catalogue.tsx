import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight, Tag } from 'lucide-react';

export const Catalogue: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceType, setPriceType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedLevel !== 'all') params.append('level', selectedLevel);
    if (priceType !== 'all') params.append('priceType', priceType);
    if (searchTerm) params.append('search', searchTerm);

    api.get(`/courses?${params.toString()}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, selectedLevel, priceType, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Catalogue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore comprehensive engineering and data programs. Free foundational courses available.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, topic, or instructor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Price Tabs */}
          <div className="sm:col-span-4 flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPriceType('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                priceType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pricing
            </button>
            <button
              onClick={() => setPriceType('free')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                priceType === 'free' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              100% Free
            </button>
            <button
              onClick={() => setPriceType('paid')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                priceType === 'paid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid Only
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses found matching your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filters or modifying your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
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
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400 mb-1">
                    <span>{c.level}</span>
                    <span>•</span>
                    <span>{c.durationHours} Hours</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition">
                    <Link to={`/courses/${c.slug}`}>{c.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.totalLessons} Lessons ({c.totalModules} Modules)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.enrolledCount} Enrolled</span>
                  </div>
                </div>

                <Link
                  to={`/courses/${c.slug}`}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl text-center transition block"
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
