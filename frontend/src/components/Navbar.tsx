import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  LogOut,
  User,
  Shield,
  Layers,
  DollarSign,
  HelpCircle,
  Video,
  Award,
  Settings,
  Menu,
  X,
  FileCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Super Admin</span>;
      case 'MENTOR':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Mentor / Lecturer</span>;
      case 'CONTENT_MANAGER':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Content Manager</span>;
      case 'FINANCE_SUPPORT':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Finance & Support</span>;
      case 'MODERATOR':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Moderator</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Student</span>;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AuraLMS
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 ml-1.5 border-l border-slate-300 pl-1.5">
                  Online Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/courses') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Browse Catalogue
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/verify-certificate') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Verify Certificate
              </Link>

              {/* Student Nav */}
              {isAuthenticated && user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/student/doubts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/doubts') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    Doubts
                  </Link>
                  <Link
                    to="/student/live-classes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/live-classes') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    Live Classes
                  </Link>
                  <Link
                    to="/student/orders"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/orders') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    Orders & Invoices
                  </Link>
                </>
              )}

              {/* Mentor Nav */}
              {isAuthenticated && user?.role === 'MENTOR' && (
                <>
                  <Link
                    to="/mentor/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mentor/dashboard') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    Mentor Hub
                  </Link>
                  <Link
                    to="/mentor/doubts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mentor/doubts') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    Doubt Queue
                  </Link>
                  <Link
                    to="/mentor/live-classes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mentor/live-classes') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    Live Sessions
                  </Link>
                </>
              )}

              {/* Content Manager Nav */}
              {isAuthenticated && user?.role === 'CONTENT_MANAGER' && (
                <Link
                  to="/content/courses"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/content/courses') ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                  }`}
                >
                  Curriculum Studio
                </Link>
              )}

              {/* Finance Nav */}
              {isAuthenticated && user?.role === 'FINANCE_SUPPORT' && (
                <Link
                  to="/finance/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/finance/dashboard') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  Finance & Refunds
                </Link>
              )}

              {/* Moderator Nav */}
              {isAuthenticated && user?.role === 'MODERATOR' && (
                <Link
                  to="/moderator/queue"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/moderator/queue') ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  Moderation Queue
                </Link>
              )}

              {/* Super Admin Nav */}
              {isAuthenticated && user?.role === 'SUPER_ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/dashboard') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  >
                    Admin Console
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/users') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  >
                    Users & Roles
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/audit-logs') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  >
                    Audit Trail
                  </Link>
                  <Link
                    to="/admin/maintenance"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/maintenance') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  >
                    Maintenance
                  </Link>
                  <Link
                    to="/admin/simulator"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/simulator') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  >
                    Webhook Simulator
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Auth State */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/student/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    {getRoleBadge(user.role)}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Browse Catalogue
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Verify Certificate
          </Link>

          {isAuthenticated ? (
            <>
              <div className="pt-2 pb-1 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                  Account ({user?.role})
                </div>
              </div>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile & Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
