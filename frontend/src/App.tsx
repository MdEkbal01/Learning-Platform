import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { QuickRoleSwitcher } from './components/QuickRoleSwitcher';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Catalogue } from './pages/Catalogue';
import { CourseDetail } from './pages/CourseDetail';
import { Checkout } from './pages/Checkout';
import { VerifyCertificate } from './pages/VerifyCertificate';

// Preferences, Feedback & Support (Section 15)
import { Settings } from './pages/Settings';
import { HelpCenter } from './pages/Help/HelpCenter';

// Auth Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';

// Student Pages
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { Classroom } from './pages/Student/Classroom';
import { DoubtTickets } from './pages/Student/DoubtTickets';
import { StudentOrders } from './pages/Student/StudentOrders';
import { StudentLiveClasses } from './pages/Student/StudentLiveClasses';
import { Profile } from './pages/Student/Profile';

// Mentor Pages
import { MentorDashboard } from './pages/Mentor/MentorDashboard';
import { MentorDoubts } from './pages/Mentor/MentorDoubts';

// Content Manager Pages
import { CourseList } from './pages/ContentManager/CourseList';
import { CourseEditor } from './pages/ContentManager/CourseEditor';

// Finance Pages
import { FinanceDashboard } from './pages/Finance/FinanceDashboard';

// Moderator Pages
import { ModerationQueue } from './pages/Moderator/ModerationQueue';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { AuditLogs } from './pages/Admin/AuditLogs';
import { MaintenanceSettings } from './pages/Admin/MaintenanceSettings';
import { WebhookSimulator } from './pages/Admin/WebhookSimulator';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeLanguageProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-600 selection:text-white">
            <QuickRoleSwitcher />
            <MaintenanceBanner />
            <Navbar />

            <main className="flex-1">
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
                  path="/admin/simulator"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <WebhookSimulator />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </ThemeLanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
