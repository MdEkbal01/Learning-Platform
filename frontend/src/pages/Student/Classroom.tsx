import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import confetti from 'canvas-confetti';
import { AiTutorDrawer } from '../../components/AiTutorDrawer';
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  HelpCircle,
  MessageSquare,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  Flag,
  AlertCircle,
  Sparkles,
  Bot,
} from 'lucide-react';

export const Classroom: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'NOTES' | 'RESOURCES' | 'QUIZ' | 'FORUM' | 'DOUBT' | 'AI_TUTOR'>('NOTES');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [progressLookup, setProgressLookup] = useState<{ [id: string]: { isCompleted: boolean; lastPlaybackPositionSeconds: number } }>({});
  const [certificate, setCertificate] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<{ [id: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // Forum state
  const [topics, setTopics] = useState<any[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [isPostingTopic, setIsPostingTopic] = useState(false);

  // Doubt submission state
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtDesc, setDoubtDesc] = useState('');
  const [doubtFile, setDoubtFile] = useState<File | null>(null);
  const [doubtSuccessMsg, setDoubtSuccessMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isEmbedVideo = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getNormalizedEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }
    return url;
  };

  const fetchClassroom = async () => {
    try {
      const res = await api.get(`/student/classroom/${courseId}`);
      setCourse(res.data.course);
      setProgressLookup(res.data.progressLookup || {});
      setCertificate(res.data.certificate);

      // Default active lesson: first incomplete lesson or first lesson
      if (!activeLesson && res.data.course?.modules?.length > 0) {
        const allLessons = res.data.course.modules.flatMap((m: any) => m.lessons);
        const firstIncomplete = allLessons.find(
          (l: any) => !res.data.progressLookup[l.id]?.isCompleted
        );
        setActiveLesson(firstIncomplete || allLessons[0]);

        // Expand corresponding module
        const targetMod = res.data.course.modules.find((m: any) =>
          m.lessons.some((l: any) => l.id === (firstIncomplete || allLessons[0])?.id)
        );
        if (targetMod) {
          setExpandedModules({ [targetMod.id]: true });
        }
      }
    } catch (err: any) {
      console.error('Failed to load classroom', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroom();
    fetchForumTopics();
  }, [courseId]);

  const fetchForumTopics = async () => {
    try {
      const res = await api.get(`/forum/courses/${courseId}/topics`);
      setTopics(res.data);
    } catch {}
  };

  // Restore playback position on video load
  const handleLoadedMetadata = () => {
    if (videoRef.current && activeLesson) {
      const savedPos = progressLookup[activeLesson.id]?.lastPlaybackPositionSeconds || 0;
      if (savedPos > 5) {
        videoRef.current.currentTime = savedPos;
      }
    }
  };

  // Save playback position periodically
  const handleTimeUpdate = () => {
    if (videoRef.current && activeLesson) {
      const currentPos = Math.round(videoRef.current.currentTime);
      if (currentPos % 15 === 0 && currentPos > 0) {
        api.post(`/student/lessons/${activeLesson.id}/progress`, {
          lastPlaybackPositionSeconds: currentPos,
        }).catch(() => {});
      }
    }
  };

  const toggleLessonComplete = async (lessonId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await api.post(`/student/lessons/${lessonId}/progress`, {
        isCompleted: newStatus,
        lastPlaybackPositionSeconds: videoRef.current ? Math.round(videoRef.current.currentTime) : 0,
      });

      setProgressLookup((prev) => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          isCompleted: newStatus,
          lastPlaybackPositionSeconds: prev[lessonId]?.lastPlaybackPositionSeconds || 0,
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLesson = (lesson: any, modId: string) => {
    setActiveLesson(lesson);
    setExpandedModules((prev) => ({ ...prev, [modId]: true }));
    setQuizResult(null);
  };

  // Load Module Quiz
  const handleLoadModuleQuiz = async (moduleId: string) => {
    try {
      const res = await api.get(`/student/quizzes/${moduleId}`);
      setCurrentQuiz(res.data);
      setSelectedAnswers({});
      setQuizResult(null);
      setActiveTab('QUIZ');
    } catch (e: any) {
      alert(e.response?.data?.error || 'No quiz found for this module.');
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    setIsSubmittingQuiz(true);
    try {
      const res = await api.post(`/student/quizzes/${currentQuiz.moduleId}/submit`, {
        answers: selectedAnswers,
      });
      setQuizResult(res.data);
      if (res.data.isPassed) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to submit quiz.');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Create Forum Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicContent) return;
    setIsPostingTopic(true);
    try {
      await api.post(`/forum/courses/${courseId}/topics`, {
        title: newTopicTitle,
        content: newTopicContent,
      });
      setNewTopicTitle('');
      setNewTopicContent('');
      fetchForumTopics();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to post topic.');
    } finally {
      setIsPostingTopic(false);
    }
  };

  // Submit Doubt Ticket
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtTitle || !doubtDesc) return;
    try {
      const formData = new FormData();
      formData.append('courseId', course.id);
      if (activeLesson) formData.append('lessonId', activeLesson.id);
      formData.append('title', doubtTitle);
      formData.append('description', doubtDesc);
      if (doubtFile) formData.append('attachment', doubtFile);

      await api.post('/doubts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDoubtSuccessMsg('Doubt ticket submitted to your course mentor! Check the Doubts tab for replies.');
      setDoubtTitle('');
      setDoubtDesc('');
      setDoubtFile(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit doubt.');
    }
  };

  // Unlock Certificate
  const handleGenerateCertificate = async () => {
    try {
      const res = await api.get(`/student/certificates/${course.id}`);
      setCertificate(res.data);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Please complete all lessons before claiming certificate.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold">Classroom Access Unavailable</h2>
        <Link to="/courses" className="mt-4 text-zinc-900 dark:text-zinc-100 underline block">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const allLessons = course.modules?.flatMap((m: any) => m.lessons) || [];
  const completedCount = allLessons.filter((l: any) => progressLookup[l.id]?.isCompleted).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isLessonCompleted = activeLesson && progressLookup[activeLesson.id]?.isCompleted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Classroom Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <Link to="/student/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>{course.category?.name}</span>
          </div>
          <h1 className="text-lg font-extrabold text-zinc-900 mt-0.5">{course.title}</h1>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-700">{progressPercent}% Mastered</div>
            <div className="text-[11px] text-zinc-400">{completedCount} of {allLessons.length} lessons</div>
          </div>
          <div className="w-24 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-black dark:bg-white text-white dark:text-black'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progressPercent === 100 && (
            <button
              onClick={handleGenerateCertificate}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer animate-bounce"
            >
              <Award className="w-4 h-4" />
              <span>{certificate ? 'View Certificate' : 'Claim Certificate!'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Interactive Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Lecture Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-md border border-zinc-900">
            {activeLesson?.videoUrl ? (
              isEmbedVideo(activeLesson.videoUrl) ? (
                <iframe
                  key={activeLesson.id}
                  src={getNormalizedEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  className="w-full aspect-video bg-black border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={activeLesson.id}
                  controls
                  src={activeLesson.videoUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full aspect-video bg-black"
                  poster={course.thumbnail}
                />
              )
            ) : (
              <div className="w-full aspect-video bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 text-xs p-6 text-center space-y-2">
                <PlayCircle className="w-12 h-12 text-zinc-600" />
                <p>This lecture is an architectural reading / exercise module.</p>
                <p className="text-zinc-500">Read the lecture notes below and proceed to assessment.</p>
              </div>
            )}

            <div className="p-4 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Active Lesson</span>
                <h2 className="text-base font-bold text-white mt-0.5">{activeLesson?.title}</h2>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAiDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  title="Ask Ken AI about this lesson"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Tutor</span>
                </button>

                <button
                  onClick={() => toggleLessonComplete(activeLesson?.id, isLessonCompleted)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                    isLessonCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLessonCompleted ? 'Completed ✓' : 'Mark Lesson Complete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Lesson Tabs */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="flex border-b border-zinc-200 bg-zinc-50/70 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('NOTES')}
                className={`px-4 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'NOTES'
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-zinc-100 bg-white font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lecture Notes</span>
              </button>
              <button
                onClick={() => setActiveTab('AI_TUTOR')}
                className={`px-4 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'AI_TUTOR'
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-zinc-100 bg-white font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-500" />
                <span>AI Study Companion</span>
              </button>
              <button
                onClick={() => setActiveTab('RESOURCES')}
                className={`px-4 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'RESOURCES'
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-zinc-100 bg-white font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Attachments ({activeLesson?.resources?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('FORUM')}
                className={`px-4 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'FORUM'
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-zinc-100 bg-white font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Course Discussions ({topics.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('DOUBT')}
                className={`px-4 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'DOUBT'
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-zinc-100 bg-white font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ask Mentor Doubt</span>
              </button>
            </div>

            <div className="p-6">
              {/* TAB 1: NOTES */}
              {activeTab === 'NOTES' && (
                <div className="prose prose-sm max-w-none text-zinc-700 leading-relaxed space-y-4">
                  {activeLesson?.notesMarkdown ? (
                    <div className="whitespace-pre-wrap font-sans bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      {activeLesson.notesMarkdown}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      No supplementary written notes for this specific lecture. Refer to video instruction above.
                    </p>
                  )}
                </div>
              )}

              {/* TAB: AI STUDY COMPANION */}
              {activeTab === 'AI_TUTOR' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-tr from-amber-50 to-yellow-50 dark:from-zinc-900 dark:to-zinc-900 p-6 rounded-2xl border border-amber-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-sm shrink-0">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                          Ken AI Study Companion
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          Instant concept breakdowns, code debugging, and quiz assessments for <strong>{activeLesson?.title || 'Current Lesson'}</strong>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAiDrawerOpen(true)}
                      className="px-5 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Launch AI Companion</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: 'Explain with Code Examples', prompt: 'Explain the core logic of this lesson with a working TypeScript/Go snippet.' },
                      { title: 'Generate 3 Practice Questions', prompt: 'Create 3 multiple-choice practice questions with detailed explanations.' },
                      { title: 'Summarize 5 Bullet Points', prompt: 'Provide a crisp 5-point summary of key concepts covered in this lecture.' },
                      { title: 'Debug Architecture Edge Cases', prompt: 'What are common failure modes and race conditions with this pattern?' },
                    ].map((card) => (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => {
                          setIsAiDrawerOpen(true);
                        }}
                        className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-black dark:hover:border-white text-left transition space-y-1 cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                          <span>{card.title}</span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-60 group-hover:opacity-100" />
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{card.prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'RESOURCES' && (
                <div className="space-y-3">
                  {activeLesson?.resources?.length > 0 ? (
                    activeLesson.resources.map((r: any) => (
                      <div
                        key={r.id}
                        className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                          <span className="font-semibold text-zinc-800">{r.title}</span>
                          <span className="text-zinc-400 font-mono">({Math.round(r.fileSize / 1024)} KB)</span>
                        </div>
                        <a
                          href={r.fileUrl}
                          download
                          className="px-3 py-1 bg-white border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white font-medium transition"
                        >
                          Download Resource
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500">No downloadable files attached to this lecture.</p>
                  )}
                </div>
              )}

              {/* TAB 3: QUIZ ASSESSMENT */}
              {activeTab === 'QUIZ' && currentQuiz && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-base">{currentQuiz.title}</h3>
                      <p className="text-xs text-zinc-500">Passing score: {currentQuiz.passPercentage}%</p>
                    </div>
                    {quizResult && (
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          quizResult.isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {quizResult.isPassed ? 'PASSED ✓' : 'FAILED - RETAKE AVAILABLE'} ({quizResult.percentage}%)
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    {currentQuiz.questions?.map((q: any, idx: number) => {
                      const feedback = quizResult?.feedback?.find((f: any) => f.questionId === q.id);
                      return (
                        <div key={q.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                          <div className="text-xs font-bold text-zinc-800">
                            Question {idx + 1}: {q.question}
                          </div>

                          <div className="space-y-2">
                            {q.options?.map((opt: any) => {
                              const isSelected = selectedAnswers[q.id] === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  disabled={!!quizResult}
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition flex items-center space-x-2 ${
                                    isSelected
                                      ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected ? 'border-zinc-900 dark:border-white bg-black dark:bg-white text-white dark:text-black text-white' : 'border-zinc-300'
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span>{opt.optionText}</span>
                                </button>
                              );
                            })}
                          </div>

                          {feedback && (
                            <div className={`p-2.5 rounded-lg text-xs ${feedback.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                              <strong>{feedback.isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {feedback.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizResult ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmittingQuiz}
                      className="w-full py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      {isSubmittingQuiz ? 'Grading Answers...' : 'Submit Assessment for Grading'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuizResult(null)}
                      className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              )}

              {/* TAB 4: FORUM */}
              {activeTab === 'FORUM' && (
                <div className="space-y-6">
                  {/* Create Topic Form */}
                  <form onSubmit={handleCreateTopic} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                    <div className="font-bold text-xs text-zinc-800">Ask a Question in Course Community</div>
                    <input
                      type="text"
                      required
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      placeholder="Topic title (e.g. Question on Module 1 Docker Compose)"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                    <textarea
                      required
                      rows={3}
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      placeholder="Describe your question or insight in detail..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isPostingTopic}
                      className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-lg transition"
                    >
                      {isPostingTopic ? 'Publishing...' : 'Publish Topic'}
                    </button>
                  </form>

                  {/* Topics List */}
                  <div className="space-y-3">
                    {topics.map((t) => (
                      <div key={t.id} className="p-4 bg-white border border-zinc-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-zinc-900 text-xs">{t.title}</h4>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600">{t.content}</p>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                          <span>By {t.author?.name} ({t.author?.role})</span>
                          <span>{t._count?.posts || 0} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ASK DOUBT */}
              {activeTab === 'DOUBT' && (
                <div className="space-y-4">
                  {doubtSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doubtSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitDoubt} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Doubt Title</label>
                      <input
                        type="text"
                        required
                        value={doubtTitle}
                        onChange={(e) => setDoubtTitle(e.target.value)}
                        placeholder={`Question regarding ${activeLesson?.title || 'this lesson'}`}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Detailed Explanation</label>
                      <textarea
                        required
                        rows={4}
                        value={doubtDesc}
                        onChange={(e) => setDoubtDesc(e.target.value)}
                        placeholder="Explain the error code, timestamp, or concept you'd like your mentor to clarify..."
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Optional Attachment (PDF, Image / Screenshot - max 10MB)
                      </label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        onChange={(e) => setDoubtFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 dark:bg-zinc-900 file:text-zinc-900 dark:text-zinc-100 hover:file:bg-zinc-100 dark:bg-zinc-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Submit Doubt Ticket to Assigned Mentor
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus Navigation Accordion */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-4">
            <h3 className="font-bold text-zinc-900 text-sm mb-3">Syllabus Breakdown</h3>

            <div className="space-y-2">
              {course.modules?.map((mod: any, mIdx: number) => {
                const isExpanded = expandedModules[mod.id];
                return (
                  <div key={mod.id} className="border border-zinc-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedModules((p) => ({ ...p, [mod.id]: !p[mod.id] }))}
                      className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between text-left transition"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase">Module {mIdx + 1}</div>
                        <div className="text-xs font-bold text-zinc-800 line-clamp-1">{mod.title}</div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-zinc-100">
                        {mod.lessons?.map((l: any) => {
                          const isActive = activeLesson?.id === l.id;
                          const completed = progressLookup[l.id]?.isCompleted;
                          return (
                            <button
                              key={l.id}
                              onClick={() => handleSelectLesson(l, mod.id)}
                              className={`w-full p-2.5 text-left text-xs flex items-center justify-between transition cursor-pointer ${
                                isActive ? 'bg-zinc-100 dark:bg-zinc-900 font-bold text-zinc-900 dark:text-zinc-100 border-l-4 border-zinc-900 dark:border-white' : 'hover:bg-zinc-50 text-zinc-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2 line-clamp-1">
                                {completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                                )}
                                <span className="truncate">{l.title}</span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono ml-2 shrink-0">{l.durationMinutes}m</span>
                            </button>
                          );
                        })}

                        {/* Module Assessment Link */}
                        {mod.quiz && (
                          <div className="p-2.5 bg-amber-50/50 flex items-center justify-between text-xs">
                            <span className="font-semibold text-amber-900 flex items-center space-x-1">
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span>{mod.quiz.title}</span>
                            </span>
                            <button
                              onClick={() => handleLoadModuleQuiz(mod.id)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                            >
                              Take Assessment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ask Ken AI Button */}
      <button
        type="button"
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-2xl shadow-2xl flex items-center space-x-2 hover:scale-105 transition transform cursor-pointer border border-zinc-200 dark:border-zinc-800"
        title="Open Ken AI Study Companion"
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <Bot className="w-4 h-4 text-amber-400 dark:text-amber-600" />
        <span>Ask AI Tutor</span>
      </button>

      {/* Real-Time AI Tutor Drawer */}
      <AiTutorDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currentCourseTitle={course?.title}
        currentLessonTitle={activeLesson?.title}
      />
    </div>
  );
};
