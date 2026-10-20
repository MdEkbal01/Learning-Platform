import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  PlayCircle,
  Lock,
  FileText,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreviewVideo, setActivePreviewVideo] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    setIsLoading(true);
    api.get(`/courses/${idOrSlug}`)
      .then((res) => {
        setCourse(res.data);
        if (res.data.previewVideoUrl) {
          setActivePreviewVideo(res.data.previewVideoUrl);
        }
        // Expand first module by default
        if (res.data.modules?.length > 0) {
          setExpandedModules({ [res.data.modules[0].id]: true });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [idOrSlug]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollFree = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/payment/create-order', { courseId: course.id });
      navigate(`/student/classroom/${course.id}`);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Enrolment failed.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="mt-4 text-blue-600 underline block">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Course Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {course.category?.name}
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {course.level} Level
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {course.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-300" />
                <span>Instructor: <strong className="text-white">{course.instructorName}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-300" />
                <span>Duration: <strong className="text-white">{course.durationHours} Hours</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Access: <strong className="text-white">{course.accessDurationDays ? `${course.accessDurationDays} Days` : 'Lifetime Access'}</strong></span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Tuition & Enrolment</div>
              <div className="text-4xl font-black text-slate-900">
                {course.isFree ? (
                  <span className="text-emerald-600">Free Access</span>
                ) : (
                  <span>${course.price}</span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">One-time payment • No subscription lock-in</div>
            </div>

            <div className="py-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full access to all lectures & notes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Interactive module assessments & quizzes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct mentor doubt ticket resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Accredited certificate of completion</span>
              </div>
            </div>

            {course.isEnrolled ? (
              <Link
                to={`/student/classroom/${course.id}`}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl text-center shadow-md transition block"
              >
                Continue Learning →
              </Link>
            ) : course.isFree ? (
              <button
                onClick={handleEnrollFree}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl text-center shadow-md transition cursor-pointer"
              >
                Enroll Now (Free)
              </button>
            ) : (
              <Link
                to={`/checkout/${course.id}`}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center shadow-md transition block"
              >
                Enroll Now • ${course.price}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Video Preview & Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Lecture Preview Video Player */}
          {activePreviewVideo && (
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <div className="p-3 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-4 h-4 text-blue-400" />
                  <span>Free Preview Player</span>
                </div>
                <span className="text-slate-400">Click previewable lessons below to switch video</span>
              </div>
              <video
                controls
                src={activePreviewVideo}
                className="w-full aspect-video bg-black"
                poster={course.thumbnail}
              />
            </div>
          )}

          {/* Curriculum Syllabus Accordion */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Course Curriculum & Syllabus</h2>
              <span className="text-xs text-slate-500 font-medium">
                {course.modules?.length || 0} Modules •{' '}
                {course.modules?.reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0)} Lectures
              </span>
            </div>

            <div className="space-y-3">
              {course.modules?.map((mod: any, mIdx: number) => {
                const isExpanded = expandedModules[mod.id];
                return (
                  <div key={mod.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Module {mIdx + 1}
                        </div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">{mod.title}</div>
                        {mod.description && (
                          <div className="text-xs text-slate-500 mt-0.5">{mod.description}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span>{mod.lessons?.length || 0} lessons</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-slate-100">
                        {mod.lessons?.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center space-x-3">
                              {lesson.isPreview || course.isEnrolled || course.isFree ? (
                                <button
                                  onClick={() => lesson.videoUrl && setActivePreviewVideo(lesson.videoUrl)}
                                  className="text-blue-600 hover:text-blue-800 transition"
                                  title="Play Preview"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <span title="Enrolment Required">
                                  <Lock className="w-4 h-4 text-slate-400" />
                                </span>
                              )}
                              <span className="font-medium text-slate-800">{lesson.title}</span>
                              {lesson.isPreview && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Preview
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 font-mono">{lesson.durationMinutes}m</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Instructor & Course Features */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Course Instructor</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                {course.instructorName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">{course.instructorName}</div>
                <div className="text-xs text-slate-500">Lead Academic Specialist</div>
              </div>
            </div>
            {course.mentor?.profile?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {course.mentor.profile.bio}
              </p>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Includes In This Course</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Structured video syllabus with resume playback</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Downloadable architectural notes & PDFs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Certificate of completion with unique ID</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
