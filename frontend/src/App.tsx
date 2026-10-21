import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy-loaded routes for ultra-fast initial bundle loading
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Catalogue = lazy(() => import('./pages/Catalogue').then((m) => ({ default: m.Catalogue })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then((m) => ({ default: m.CourseDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate').then((m) => ({ default: m.VerifyCertificate })));

// Preferences, Feedback & Support (Section 15)
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const HelpCenter = lazy(() => import('./pages/Help/HelpCenter').then((m) => ({ default: m.HelpCenter })));

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/Student/StudentDashboard').then((m) => ({ default: m.StudentDashboard })));
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

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement').then((m) => ({ default: m.UserManagement })));
const AuditLogs = lazy(() => import('./pages/Admin/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const MaintenanceSettings = lazy(() => import('./pages/Admin/MaintenanceSettings').then((m) => ({ default: m.MaintenanceSettings })));
const WebhookSimulator = lazy(() => import('./pages/Admin/WebhookSimulator').then((m) => ({ default: m.WebhookSimulator })));

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200">
    <div className="w-7 h-7 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
    <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">Loading</span>
  </div>
);

export const App: React.FC = () => {
  // Idle-time chunk preloading for ultra-smooth instant navigation
  React.useEffect(() => {
    const scheduleIdle =
      (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 800));

    scheduleIdle(() => {
      import('./pages/Catalogue');
      import('./pages/Auth/Login');
      import('./pages/Student/StudentDashboard');
      import('./pages/Admin/AdminDashboard');
      import('./pages/VerifyCertificate');
      import('./pages/Help/HelpCenter');
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeLanguageProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <MaintenanceBanner />
            <Navbar />

            <main className="flex-1">
              <Suspense fallback={<PageLoadingFallback />}>
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
                  <Route
                    path="/mentor/live-classes"
                    element={
                      <ProtectedRoute allowedRoles={['MENTOR']}>
                        <MentorDashboard />
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
                    path="/content/courses/:id"
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

                  {/* Super Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/audit-logs"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                        <AuditLogs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/maintenance"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                        <MaintenanceSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/simulator"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                        <WebhookSimulator />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </ThemeLanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
