import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  Plus,
  Edit,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink,
  Send,
  Eye,
} from 'lucide-react';

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // New Course Modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newPrice, setNewPrice] = useState('0');
  const [newIsFree, setNewIsFree] = useState(true);
  const [newInstructor, setNewInstructor] = useState('Prof. Alex Rivera');
  const [isCreating, setIsCreating] = useState(false);

  const fetchCourses = async () => {
    try {
      const [coursesRes, catRes] = await Promise.all([
        api.get('/content/courses'),
        api.get('/categories'),
      ]);
      setCourses(coursesRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setNewCatId(catRes.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      await api.patch(`/content/courses/${courseId}/status`, { status: newStatus });
      fetchCourses();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update course status.');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post('/content/courses', {
        title: newTitle,
        description: newDesc,
        categoryId: newCatId,
        price: newPrice,
        isFree: newIsFree,
        instructorName: newInstructor,
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchCourses();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to create course.');
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = statusFilter === 'ALL' ? courses : courses.filter((c) => c.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-amber-600 tracking-wider">Curriculum Operations</div>
          <h1 className="text-2xl font-black text-zinc-900 mt-0.5">Course Authoring & Publishing Studio</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Build modules, organise lectures, define quizzes, and execute the Draft → Review → Published workflow.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-semibold w-fit">
        {['ALL', 'DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === st ? 'bg-white text-amber-800 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Courses List Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Discipline</th>
                <th className="p-4">Price</th>
                <th className="p-4">Modules</th>
                <th className="p-4">Enrolled</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Workflow & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 text-xs">{c.title}</div>
                    <div className="text-[11px] text-zinc-400">Instructor: {c.instructorName}</div>
                  </td>
                  <td className="p-4 text-zinc-600 font-medium">{c.category?.name}</td>
                  <td className="p-4 font-bold text-zinc-900">{c.isFree ? 'Free' : `$${c.price}`}</td>
                  <td className="p-4 text-zinc-600">{c._count?.modules || 0} Modules</td>
                  <td className="p-4 text-zinc-600">{c._count?.enrolments || 0} Students</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'IN_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : c.status === 'ARCHIVED'
                          ? 'bg-zinc-200 text-zinc-800'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <Link
                        to={`/content/courses/${c.id}`}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition"
                      >
                        Edit Syllabus
                      </Link>

                      {c.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'IN_REVIEW')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-amber-100 text-zinc-700 font-semibold rounded-lg transition"
                          title="Submit for Review"
                        >
                          Submit Review
                        </button>
                      )}

                      {c.status === 'IN_REVIEW' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'PUBLISHED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                          title="Publish Course"
                        >
                          Publish
                        </button>
                      )}

                      {c.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'ARCHIVED')}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-rose-100 text-zinc-600 hover:text-rose-700 rounded-lg transition"
                          title="Archive"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Create New Course</h3>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Microservices in Go"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Comprehensive curriculum syllabus summary..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Discipline</label>
                  <select
                    value={newCatId}
                    onChange={(e) => setNewCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-2 font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsFree}
                    onChange={(e) => setNewIsFree(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>100% Free Course</span>
                </label>

                {!newIsFree && (
                  <div className="flex items-center space-x-1">
                    <span>Price ($):</span>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-20 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
                >
                  {isCreating ? 'Creating...' : 'Create Course in Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
