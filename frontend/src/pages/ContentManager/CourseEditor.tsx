import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Award,
  CheckCircle,
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add Module modal
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');

  // Add Lesson modal
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState('');
  const [lesTitle, setLesTitle] = useState('');
  const [lesDuration, setLesDuration] = useState('20');
  const [lesVideoUrl, setLesVideoUrl] = useState('');
  const [lesNotes, setLesNotes] = useState('');
  const [lesIsPreview, setLesIsPreview] = useState(false);

  // Quiz Editor modal
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizModuleId, setQuizModuleId] = useState('');
  const [quizTitle, setQuizTitle] = useState('Module Assessment');
  const [quizPassPct, setQuizPassPct] = useState('70');
  const [q1Text, setQ1Text] = useState('What is the main architectural benefit of least-privilege RBAC?');
  const [q1Opt1, setQ1Opt1] = useState('Enforces tight security boundaries across student and staff roles');
  const [q1Opt2, setQ1Opt2] = useState('Allows all users to view administrative billing records');
  const [q1CorrectIdx, setQ1CorrectIdx] = useState('0');

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/content/courses/${id}/modules`, {
        title: modTitle,
        description: modDesc,
      });
      setShowModuleModal(false);
      setModTitle('');
      setModDesc('');
      fetchCourse();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to add module.');
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/content/modules/${targetModuleId}/lessons`, {
        title: lesTitle,
        durationMinutes: parseInt(lesDuration, 10),
        videoUrl: lesVideoUrl,
        notesMarkdown: lesNotes,
        isPreview: lesIsPreview,
      });
      setShowLessonModal(false);
      setLesTitle('');
      setLesVideoUrl('');
      setLesNotes('');
      fetchCourse();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to add lesson.');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/content/lessons/${lessonId}`);
      fetchCourse();
    } catch (e) {
      alert('Failed to delete lesson.');
    }
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questions = [
        {
          question: q1Text,
          explanation: 'Principle of Least Privilege restricts access strictly to required operations.',
          options: [
            { optionText: q1Opt1, isCorrect: q1CorrectIdx === '0' },
            { optionText: q1Opt2, isCorrect: q1CorrectIdx === '1' },
          ],
        },
      ];

      await api.post(`/content/modules/${quizModuleId}/quiz`, {
        title: quizTitle,
        passPercentage: parseInt(quizPassPct, 10),
        questions,
      });

      setShowQuizModal(false);
      fetchCourse();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to save quiz.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">Course not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <Link to="/content/courses" className="hover:underline flex items-center space-x-1 text-zinc-700 dark:text-zinc-300">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum Studio</span>
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-bold">{course.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2.5 py-0.5 rounded-full">
            Status: {course.status}
          </span>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{course.title}</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Category: {course.category?.name} • Tuition: {course.isFree ? 'Free' : `$${course.price}`}
          </p>
        </div>

        <button
          onClick={() => setShowModuleModal(true)}
          className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Module</span>
        </button>
      </div>

      {/* Modules & Lessons Curriculum Tree */}
      <div className="space-y-4">
        {course.modules?.length === 0 ? (
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
            No modules yet. Click "Add New Module" to structure your syllabus.
          </div>
        ) : (
          course.modules?.map((mod: any, mIdx: number) => (
            <div key={mod.id} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
              <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Module {mIdx + 1}</div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{mod.title}</h3>
                  {mod.description && <div className="text-xs text-zinc-500 dark:text-zinc-400">{mod.description}</div>}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setTargetModuleId(mod.id);
                      setShowLessonModal(true);
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-lg transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuizModuleId(mod.id);
                      setShowQuizModal(true);
                    }}
                    className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 border border-zinc-300 dark:border-zinc-700"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{mod.quiz ? 'Edit Quiz' : 'Add Quiz'}</span>
                  </button>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {mod.lessons?.map((les: any) => (
                  <div key={les.id} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition">
                    <div className="flex items-center space-x-3">
                      <Video className="w-4 h-4 text-zinc-400" />
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-2">
                          <span>{les.title}</span>
                          {les.isPreview && (
                            <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-zinc-300 dark:border-zinc-700">
                              Free Preview
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500">Duration: {les.durationMinutes} mins</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteLesson(les.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Add Curriculum Module</h3>
            <form onSubmit={handleAddModule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                  placeholder="e.g. Module 3: Authentication & Token Security"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  placeholder="Brief synopsis of topics covered..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Add Lesson Lecture</h3>
            <form onSubmit={handleAddLesson} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lesTitle}
                  onChange={(e) => setLesTitle(e.target.value)}
                  placeholder="e.g. 3.1 JWT Architecture & Refresh Token Rotation"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={lesDuration}
                    onChange={(e) => setLesDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Video Stream URL</label>
                  <input
                    type="url"
                    value={lesVideoUrl}
                    onChange={(e) => setLesVideoUrl(e.target.value)}
                    placeholder="https://...mp4"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Lesson Markdown Notes</label>
                <textarea
                  rows={4}
                  value={lesNotes}
                  onChange={(e) => setLesNotes(e.target.value)}
                  placeholder="### Notes for this lecture..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-mono"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={lesIsPreview}
                  onChange={(e) => setLesIsPreview(e.target.checked)}
                  className="rounded text-black dark:text-white accent-black dark:accent-white"
                />
                <span>Allow as Free Preview for Visitors & Non-Enrolled</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
                >
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Module Assessment Quiz Builder</h3>
            <form onSubmit={handleSaveQuiz} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Passing Percentage (e.g. 70)</label>
                <input
                  type="number"
                  required
                  value={quizPassPct}
                  onChange={(e) => setQuizPassPct(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">Question 1</label>
                <input
                  type="text"
                  required
                  value={q1Text}
                  onChange={(e) => setQ1Text(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={q1CorrectIdx === '0'}
                      onChange={() => setQ1CorrectIdx('0')}
                    />
                    <input
                      type="text"
                      required
                      value={q1Opt1}
                      onChange={(e) => setQ1Opt1(e.target.value)}
                      placeholder="Option 1"
                      className="flex-1 px-2.5 py-1 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded text-xs"
                    />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Correct</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={q1CorrectIdx === '1'}
                      onChange={() => setQ1CorrectIdx('1')}
                    />
                    <input
                      type="text"
                      required
                      value={q1Opt2}
                      onChange={(e) => setQ1Opt2(e.target.value)}
                      placeholder="Option 2"
                      className="flex-1 px-2.5 py-1 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded text-xs"
                    />
                    <span className="text-[10px] text-zinc-400">Incorrect</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
                >
                  Save Quiz Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
