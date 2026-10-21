import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EntranceSplash } from './components/EntranceSplash';
import { PageTransition } from './components/PageTransition';
import { ErrorBoundary } from './components/ErrorBoundary';

// Eagerly loaded primary routes for instantaneous 0ms page navigation
import { Home } from './pages/Home';
import { Catalogue } from './pages/Catalogue';
import { CourseDetail } from './pages/CourseDetail';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { Settings } from './pages/Settings';
import { HelpCenter } from './pages/Help/HelpCenter';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserManagement } from './pages/Admin/UserManagement';

// Secondary routes lazy-loaded with instant background preloading
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const Classroom = lazy(() => import('./pages/Student/Classroom').then((m) => ({ default: m.Classroom })));
const DoubtTickets = lazy(() => import('./pages/Student/DoubtTickets').then((m) => ({ default: m.DoubtTickets })));
const StudentOrders = lazy(() => import('./pages/Student/StudentOrders').then((m) => ({ default: m.StudentOrders })));
const StudentLiveClasses = lazy(() => import('./pages/Student/StudentLiveClasses').then((m) => ({ default: m.StudentLiveClasses })));
const Profile = lazy(() => import('./pages/Student/Profile').then((m) => ({ default: m.Profile })));

// Mentor Pages
const MentorDashboard = lazy(() => import('./pages/Mentor/MentorDashboard').then((m) => ({ default: m.MentorDashboard })));
const MentorDoubts = lazy(() => import('./pages/Mentor/MentorDoubts').then((m) => ({ default: m.MentorDoubts })));

// Content Manager Pages
const CourseList = lazy(() => import('./pages/ContentManager/CourseList').then((m) => ({ default: m.CourseList })));
const CourseEditor = lazy(() => import('./pages/ContentManager/CourseEditor').then((m) => ({ default: m.CourseEditor })));

// Finance Pages
const FinanceDashboard = lazy(() => import('./pages/Finance/FinanceDashboard').then((m) => ({ default: m.FinanceDashboard })));

// Moderator Pages
const ModerationQueue = lazy(() => import('./pages/Moderator/ModerationQueue').then((m) => ({ default: m.ModerationQueue })));

// Admin Secondary Pages
const AuditLogs = lazy(() => import('./pages/Admin/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const MaintenanceSettings = lazy(() => import('./pages/Admin/MaintenanceSettings').then((m) => ({ default: m.MaintenanceSettings })));
const WebhookSimulator = lazy(() => import('./pages/Admin/WebhookSimulator').then((m) => ({ default: m.WebhookSimulator })));

// Lightweight non-blocking fallback
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[40vh] flex items-center justify-center py-10">
    <div className="w-7 h-7 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

export const App: React.FC = () => {
  // Idle preloading for remaining secondary routes
  React.useEffect(() => {
    const scheduleIdle =
      (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 100));

    scheduleIdle(() => {
      import('./pages/Student/Classroom');
      import('./pages/ContentManager/CourseList');
      import('./pages/Finance/FinanceDashboard');
      import('./pages/Moderator/ModerationQueue');
      import('./pages/Admin/AuditLogs');
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeLanguageProvider>
          <EntranceSplash />
          <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <MaintenanceBanner />
            <Navbar />

            <main className="flex-1 flex flex-col">
              <ErrorBoundary>
                <Suspense fallback={<PageLoadingFallback />}>
                  <PageTransition>
                    <Routes>
                      {/* Public & Core Platform Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/courses" element={<Catalogue />} />
                      <Route path="/courses/:idOrSlug" element={<CourseDetail />} />
                      <Route path="/verify-certificate" element={<VerifyCertificate />} />
                      <Route path="/verify-certificate/:code" element={<VerifyCertificate />} />

                      {/* Section 15: Settings, Preferences, Feedback & Support */}
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/feedback" element={<HelpCenter />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Checkout (requires auth) */}
                      <Route
                        path="/checkout/:courseId"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />

                      {/* Student Routes */}
                      <Route
                        path="/student/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/classroom/:courseId"
                        element={
                          <ProtectedRoute>
                            <Classroom />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/doubts"
                        element={
                          <ProtectedRoute allowedRoles={['STUDENT']}>
                            <DoubtTickets />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/orders"
                        element={
                          <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentOrders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/live-classes"
                        element={
                          <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentLiveClasses />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />

                      {/* Mentor Routes */}
                      <Route
                        path="/mentor/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['MENTOR']}>
                            <MentorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/mentor/doubts"
                        element={
                          <ProtectedRoute allowedRoles={['MENTOR']}>
                            <MentorDoubts />
                          </ProtectedRoute>
                        }
                      />

                      {/* Content Manager Routes */}
                      <Route
                        path="/content/courses"
                        element={
                          <ProtectedRoute allowedRoles={['CONTENT_MANAGER']}>
                            <CourseList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/content/courses/new"
                        element={
                          <ProtectedRoute allowedRoles={['CONTENT_MANAGER']}>
                            <CourseEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/content/courses/:id/edit"
                        element={
                          <ProtectedRoute allowedRoles={['CONTENT_MANAGER']}>
                            <CourseEditor />
                          </ProtectedRoute>
                        }
                      />

                      {/* Finance Support Routes */}
                      <Route
                        path="/finance/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['FINANCE_SUPPORT']}>
                            <FinanceDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Moderator Routes */}
                      <Route
                        path="/moderator/queue"
                        element={
                          <ProtectedRoute allowedRoles={['MODERATOR']}>
                            <ModerationQueue />
                          </ProtectedRoute>
                        }
                      />

                      {/* Super Admin Universal Governance Routes */}
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                            <UserManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/audit-logs"
                        element={
                          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                            <AuditLogs />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/maintenance"
                        element={
                          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                            <MaintenanceSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/webhooks"
                        element={
                          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                            <WebhookSimulator />
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch-all redirect to Home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </PageTransition>
                </Suspense>
              </ErrorBoundary>
            </main>

            <Footer />
          </div>
        </ThemeLanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
