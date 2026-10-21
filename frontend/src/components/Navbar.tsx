import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  HelpCircle,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    return (
      <span className="border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">
        {t(
          role === 'SUPER_ADMIN' ? 'roleSuperAdmin' :
          role === 'MENTOR' ? 'roleMentor' :
          role === 'CONTENT_MANAGER' ? 'roleContentManager' :
          role === 'FINANCE_SUPPORT' ? 'roleFinance' :
          role === 'MODERATOR' ? 'roleModerator' : 'roleStudent'
        )}
      </span>
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive(path)
      ? 'text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 font-semibold border border-zinc-200 dark:border-zinc-800'
      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
  }`;

  return (
    <nav className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand & Main Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/80 to-amber-600/80 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center overflow-hidden shrink-0 transition transform group-hover:scale-105 duration-200">
                <img
                  src="/logo.png"
                  alt="Ken Classes Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-black dark:text-white">
                  Ken Classes
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 ml-1.5 border-l border-zinc-300 dark:border-zinc-700 pl-1.5">
                  Learning Without Limits
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/courses" className={navLinkClass('/courses')}>
                {t('browseCatalogue')}
              </Link>
              <Link to="/verify-certificate" className={navLinkClass('/verify-certificate')}>
                {t('verifyCertificate')}
              </Link>
              <Link to="/help" className={navLinkClass('/help')}>
                {t('helpAndSupport')}
              </Link>

              {/* Student Nav */}
              {isAuthenticated && user?.role === 'STUDENT' && (
                <>
                  <Link to="/student/dashboard" className={navLinkClass('/student/dashboard')}>
                    {t('myLearning')}
                  </Link>
                  <Link to="/student/doubts" className={navLinkClass('/student/doubts')}>
                    {t('doubts')}
                  </Link>
                  <Link to="/student/live-classes" className={navLinkClass('/student/live-classes')}>
                    {t('liveClasses')}
                  </Link>
                  <Link to="/student/orders" className={navLinkClass('/student/orders')}>
                    {t('ordersAndInvoices')}
                  </Link>
                </>
              )}

              {/* Mentor Nav */}
              {isAuthenticated && user?.role === 'MENTOR' && (
                <>
                  <Link to="/mentor/dashboard" className={navLinkClass('/mentor/dashboard')}>
                    Mentor Hub
                  </Link>
                  <Link to="/mentor/doubts" className={navLinkClass('/mentor/doubts')}>
                    Doubt Queue
                  </Link>
                </>
              )}

              {/* Content Manager Nav */}
              {isAuthenticated && user?.role === 'CONTENT_MANAGER' && (
                <Link to="/content/courses" className={navLinkClass('/content/courses')}>
                  Curriculum Studio
                </Link>
              )}

              {/* Finance Nav */}
              {isAuthenticated && user?.role === 'FINANCE_SUPPORT' && (
                <Link to="/finance/dashboard" className={navLinkClass('/finance/dashboard')}>
                  Finance & Refunds
                </Link>
              )}

              {/* Moderator Nav */}
              {isAuthenticated && user?.role === 'MODERATOR' && (
                <Link to="/moderator/queue" className={navLinkClass('/moderator/queue')}>
                  Moderation Queue
                </Link>
              )}

              {/* Super Admin / Admin Nav - Universal Access to All PRD Modules */}
              {isAuthenticated && (user?.role === 'SUPER_ADMIN' || (user?.role as string) === 'ADMIN') && (
                <>
                  <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                    Console
                  </Link>
                  <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                    Users
                  </Link>
                  <Link to="/content/courses" className={navLinkClass('/content/courses')}>
                    Curriculum
                  </Link>
                  <Link to="/finance/dashboard" className={navLinkClass('/finance/dashboard')}>
                    Finance
                  </Link>
                  <Link to="/moderator/queue" className={navLinkClass('/moderator/queue')}>
                    Moderation
                  </Link>
                  <Link to="/mentor/doubts" className={navLinkClass('/mentor/doubts')}>
                    Doubts
                  </Link>
                  <Link to="/student/live-classes" className={navLinkClass('/student/live-classes')}>
                    Live Classes
                  </Link>
                  <Link to="/admin/audit-logs" className={navLinkClass('/admin/audit-logs')}>
                    Audit
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Theme Toggle, Language Selector & Auth */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
            {/* Strict 2-Language Selector */}
            <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'en'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'hi'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Strict 2-Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer"
              title={theme === 'light' ? t('darkTheme') : t('lightTheme')}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-zinc-900" />
              ) : (
                <Sun className="w-4 h-4 text-zinc-100" />
              )}
            </button>

            {/* Settings Quick Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 transition ${
                isActive('/settings')
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={t('settings')}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Help Quick Link */}
            <Link
              to="/help"
              className={`p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 transition ${
                isActive('/help')
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={t('helpAndSupport')}
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* Auth Profile or Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-zinc-300 dark:border-zinc-800">
                <Link
                  to="/student/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs border border-zinc-300 dark:border-zinc-700">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    {getRoleBadge(user.role)}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition cursor-pointer"
                  title={t('signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-1 border-l border-zinc-300 dark:border-zinc-800">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 rounded-lg shadow-xs transition"
                >
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-900" /> : <Sun className="w-4 h-4 text-zinc-100" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('language')}:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs rounded font-semibold ${
                  language === 'en' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-xs rounded font-semibold ${
                  language === 'hi' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t('browseCatalogue')}
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t('verifyCertificate')}
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t('helpAndSupport')}
          </Link>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t('settings')}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="pt-2 pb-1 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3">
                  Account ({user?.role})
                </div>
              </div>

              {(user?.role === 'SUPER_ADMIN' || (user?.role as string) === 'ADMIN') && (
                <div className="space-y-1 py-1">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-3">
                    Admin Operations
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Console Overview
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    User Governance & Roles
                  </Link>
                  <Link
                    to="/content/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Curriculum Studio
                  </Link>
                  <Link
                    to="/finance/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Finance & Refunds
                  </Link>
                  <Link
                    to="/moderator/queue"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Moderation Queue
                  </Link>
                  <Link
                    to="/mentor/doubts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Doubt Resolution
                  </Link>
                  <Link
                    to="/student/live-classes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Live Masterclasses
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Security Audit Trail
                  </Link>
                </div>
              )}

              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {t('profile')}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md text-sm font-medium"
              >
                {t('getStarted')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
