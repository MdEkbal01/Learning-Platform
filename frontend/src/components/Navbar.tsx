import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  Languages,
  HelpCircle,
  Settings,
  Menu,
  X,
  FileCheck,
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
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleSuperAdmin')}</span>;
      case 'MENTOR':
        return <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleMentor')}</span>;
      case 'CONTENT_MANAGER':
        return <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleContentManager')}</span>;
      case 'FINANCE_SUPPORT':
        return <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleFinance')}</span>;
      case 'MODERATOR':
        return <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleModerator')}</span>;
      default:
        return <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{t('roleStudent')}</span>;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand & Main Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AuraLMS
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1.5 border-l border-slate-300 dark:border-slate-700 pl-1.5">
                  {t('tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/courses')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t('browseCatalogue')}
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/verify-certificate')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t('verifyCertificate')}
              </Link>
              <Link
                to="/help"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/help')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t('helpAndSupport')}
              </Link>

              {/* Student Nav */}
              {isAuthenticated && user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/dashboard')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t('myLearning')}
                  </Link>
                  <Link
                    to="/student/doubts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/doubts')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t('doubts')}
                  </Link>
                  <Link
                    to="/student/live-classes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/live-classes')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t('liveClasses')}
                  </Link>
                  <Link
                    to="/student/orders"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/orders')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t('ordersAndInvoices')}
                  </Link>
                </>
              )}

              {/* Mentor Nav */}
              {isAuthenticated && user?.role === 'MENTOR' && (
                <>
                  <Link
                    to="/mentor/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mentor/dashboard')
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Mentor Hub
                  </Link>
                  <Link
                    to="/mentor/doubts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mentor/doubts')
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Doubt Queue
                  </Link>
                </>
              )}

              {/* Content Manager Nav */}
              {isAuthenticated && user?.role === 'CONTENT_MANAGER' && (
                <Link
                  to="/content/courses"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/content/courses')
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                    isActive('/finance/dashboard')
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                    isActive('/moderator/queue')
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                      isActive('/admin/dashboard')
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Console
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/users')
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/audit-logs')
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Audit
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Theme Toggle, Language Selector & Auth */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
            {/* Strict 2-Language Selector (LANG-01 to LANG-06) */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Strict 2-Theme Toggle (PREF-01 to PREF-04) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'light' ? t('darkTheme') : t('lightTheme')}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Settings Quick Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 transition ${
                isActive('/settings')
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t('settings')}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Help Quick Link */}
            <Link
              to="/help"
              className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 transition ${
                isActive('/help')
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t('helpAndSupport')}
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* Auth Profile or Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/student/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    {getRoleBadge(user.role)}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                  title={t('signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
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
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('language')}:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs rounded font-semibold ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-xs rounded font-semibold ${
                  language === 'hi' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('browseCatalogue')}
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('verifyCertificate')}
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('helpAndSupport')}
          </Link>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('settings')}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                  Account ({user?.role})
                </div>
              </div>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('profile')}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
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
