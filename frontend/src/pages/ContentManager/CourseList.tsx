import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink,
  Send,
  Eye,
  Sliders,
  AlertTriangle,
  X,
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
  const [newPrice, setNewPrice] = useState('999');
  const [newIsFree, setNewIsFree] = useState(false);
  const [newInstructor, setNewInstructor] = useState('Er. Zainul Abideen');
  const [isCreating, setIsCreating] = useState(false);

  // Edit Attributes Modal
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [editLevel, setEditLevel] = useState('BEGINNER');
  const [editPrice, setEditPrice] = useState('999');
  const [editIsFree, setEditIsFree] = useState(false);
  const [editStatus, setEditStatus] = useState('DRAFT');
  const [editInstructor, setEditInstructor] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Group categories by stream/level
  const groupedCategories = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    categories.forEach((cat) => {
      const g = cat.group || 'All Academic Disciplines';
      if (!groups[g]) groups[g] = [];
      groups[g].push(cat);
    });
    return groups;
  }, [categories]);

  // Delete Course Confirmation Modal
  const [deleteCourse, setDeleteCourse] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async () => {
    try {
      const [coursesRes, catRes] = await Promise.all([
        api.get('/content/courses'),
        api.get('/categories'),
      ]);
      setCourses(coursesRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !newCatId) {
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
    const numericPrice = newIsFree ? 0 : parseFloat(newPrice || '0');
    const finalIsFree = newIsFree || numericPrice === 0;
    try {
      await api.post('/content/courses', {
        title: newTitle,
        description: newDesc,
        categoryId: newCatId,
        price: numericPrice,
        isFree: finalIsFree,
        instructorName: newInstructor,
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewPrice('999');
      setNewIsFree(false);
      fetchCourses();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to create course.');
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (c: any) => {
    setEditCourse(c);
    setEditTitle(c.title || '');
    setEditSubtitle(c.subtitle || '');
    setEditDesc(c.description || '');
    setEditCatId(c.category?.id || (categories[0]?.id || ''));
    setEditLevel(c.level || 'BEGINNER');
    const isActuallyFree = Boolean(c.isFree) || Number(c.price || 0) === 0;
    setEditIsFree(isActuallyFree);
    setEditPrice(isActuallyFree ? '0' : String(c.price || 999));
    setEditStatus(c.status || 'DRAFT');
    setEditInstructor(c.instructor?.name || 'Ken Classes Faculty');
  };

  const handleUpdateAttributes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;
    setIsUpdating(true);
    const numericPrice = editIsFree ? 0 : parseFloat(editPrice || '0');
    const finalIsFree = editIsFree || numericPrice === 0;
    try {
      await api.put(`/content/courses/${editCourse.id}`, {
        title: editTitle,
        subtitle: editSubtitle,
        description: editDesc,
        categoryId: editCatId,
        level: editLevel,
        price: numericPrice,
        isFree: finalIsFree,
        status: editStatus,
        instructorName: editInstructor,
      });
      setEditCourse(null);
      fetchCourses();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update course attributes.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return;
    setIsDeleting(true);
    try {
      await api.delete(`/content/courses/${deleteCourse.id}`);
      setDeleteCourse(null);
      fetchCourses();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to delete course.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = statusFilter === 'ALL' ? courses : courses.filter((c) => c.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">Curriculum Operations</div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5">Course Governance & Attribute Studio</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            List courses, configure pricing and metadata attributes, manage modules, and permanently delete courses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold space-x-4">
        {['ALL', 'DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`pb-3 px-1 transition relative cursor-pointer ${
              statusFilter === st
                ? 'text-zinc-900 dark:text-white font-bold border-b-2 border-zinc-900 dark:border-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Price</th>
                <th className="p-4">Enrolled</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 dark:text-white">{c.title}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">By {c.instructor?.name || 'Faculty'}</div>
                  </td>
                  <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    {c.category?.name || 'General'}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {c.level || 'BEGINNER'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-zinc-900 dark:text-white">
                    {c.isFree ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      `₹${(c.price || 0).toLocaleString('en-IN')}`
                    )}
                  </td>
                  <td className="p-4 font-mono text-zinc-600 dark:text-zinc-400">{c.enrolledCount || 0}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'PUBLISHED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : c.status === 'IN_REVIEW'
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                          : c.status === 'ARCHIVED'
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Set Attributes Button */}
                      <button
                        onClick={() => openEditModal(c)}
                        className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-lg transition flex items-center space-x-1 cursor-pointer"
                        title="Set Course Attributes"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Attributes</span>
                      </button>

                      {/* Edit Syllabus Link */}
                      <Link
                        to={`/content/courses/${c.id}`}
                        className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-lg transition"
                      >
                        Syllabus
                      </Link>

                      {/* Status Action Buttons */}
                      {c.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'IN_REVIEW')}
                          className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-lg transition cursor-pointer"
                        >
                          Review
                        </button>
                      )}

                      {c.status === 'IN_REVIEW' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'PUBLISHED')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                        >
                          Publish
                        </button>
                      )}

                      {/* Delete Course Button */}
                      <button
                        onClick={() => setDeleteCourse(c)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Permanently Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Create New Course</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems in Go"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Comprehensive curriculum syllabus summary..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Academic Category & Level</label>
                <select
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                >
                  {Object.entries(groupedCategories).length > 0 ? (
                    Object.entries(groupedCategories).map(([group, cats]) => (
                      <optgroup key={group} label={group} className="font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950">
                        {cats.map((c) => (
                          <option key={c.id} value={c.id} className="font-normal text-zinc-800 dark:text-zinc-200">
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Course Tuition Pricing */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white">
                    Course Pricing Model
                  </label>
                  <div className="flex items-center p-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setNewIsFree(false);
                        if (!newPrice || newPrice === '0') setNewPrice('999');
                      }}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        !newIsFree
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Paid (₹ INR)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewIsFree(true);
                        setNewPrice('0');
                      }}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        newIsFree
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      100% Free
                    </button>
                  </div>
                </div>

                {!newIsFree ? (
                  <div className="space-y-2 pt-1">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 dark:text-zinc-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={newPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewPrice(val);
                          if (Number(val) > 0) setNewIsFree(false);
                        }}
                        placeholder="e.g. 999"
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[10px] text-zinc-500 font-medium">Quick suggestions:</span>
                      {['499', '799', '999', '1499', '2499', '3999'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setNewPrice(p);
                            setNewIsFree(false);
                          }}
                          className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-[10px] font-bold text-zinc-900 dark:text-zinc-100 transition cursor-pointer"
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>This course is marked as <strong>100% Free</strong>. Students can enroll directly without payment.</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-lg transition"
                >
                  {isCreating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Attributes Modal */}
      {editCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Set Course Attributes</h3>
                <p className="text-xs text-zinc-500">Configure catalog and operational metadata.</p>
              </div>
              <button onClick={() => setEditCourse(null)} className="text-zinc-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAttributes} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Subtitle / Punchline</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="e.g. Master modern cloud architecture"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Academic Category & Level</label>
                  <select
                    value={editCatId}
                    onChange={(e) => setEditCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  >
                    {Object.entries(groupedCategories).length > 0 ? (
                      Object.entries(groupedCategories).map(([group, cats]) => (
                        <optgroup key={group} label={group} className="font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950">
                          {cats.map((c) => (
                            <option key={c.id} value={c.id} className="font-normal text-zinc-800 dark:text-zinc-200">
                              {c.name}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Difficulty Level</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              {/* Edit Tuition Pricing Model */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white">
                    Course Pricing Model
                  </label>
                  <div className="flex items-center p-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setEditIsFree(false);
                        if (!editPrice || editPrice === '0') setEditPrice('999');
                      }}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        !editIsFree
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Paid (₹ INR)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditIsFree(true);
                        setEditPrice('0');
                      }}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        editIsFree
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      100% Free
                    </button>
                  </div>
                </div>

                {!editIsFree ? (
                  <div className="space-y-2 pt-1">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 dark:text-zinc-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={editPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditPrice(val);
                          if (Number(val) > 0) setEditIsFree(false);
                        }}
                        placeholder="e.g. 999"
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[10px] text-zinc-500 font-medium">Quick suggestions:</span>
                      {['499', '799', '999', '1499', '2499', '3999'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setEditPrice(p);
                            setEditIsFree(false);
                          }}
                          className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-[10px] font-bold text-zinc-900 dark:text-zinc-100 transition cursor-pointer"
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>This course is marked as <strong>100% Free</strong>. Students can enroll directly without payment.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Instructor Name</label>
                <input
                  type="text"
                  value={editInstructor}
                  onChange={(e) => setEditInstructor(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  {isUpdating ? 'Saving...' : 'Save Attributes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {deleteCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-200 dark:border-rose-900/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Delete Course Permanently?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Are you sure you want to remove <span className="font-bold text-zinc-900 dark:text-white">{deleteCourse.title}</span>? All enrolled student assignments and curriculum modules will be removed.
              </p>
            </div>

            <div className="flex justify-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteCourse(null)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
