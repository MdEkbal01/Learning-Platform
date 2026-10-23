import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  LogOut,
  Sun,
  Moon,
  Menu,
  Search,
} from 'lucide-react';
import { FeatureMenuDrawer } from './FeatureMenuDrawer';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const navigate = useNavigate();
  const [featureDrawerOpen, setFeatureDrawerOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener to open Feature Menu Drawer from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setFeatureDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <nav className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Top-Left: 3-Line Menu Option + Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* 3-Line Menu Option shifted to the top-left side */}
            <button
              type="button"
              onClick={() => setFeatureDrawerOpen(true)}
              className="p-2 -ml-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center shadow-2xs group"
              title="All Platform Features (Menu)"
              aria-label="Open 3-line features menu"
            >
              <Menu className="w-5 h-5 text-zinc-900 dark:text-white transition-transform group-hover:scale-105" />
            </button>

            {/* Ken Classes Brand */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/80 to-amber-600/80 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center overflow-hidden shrink-0 transition transform group-hover:scale-105 duration-200">
                <img
                  src="/logo.png"
                  alt="Ken Classes Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white">
                  Ken Classes
                </span>
                <span className="hidden lg:inline-block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 ml-2 border-l border-zinc-300 dark:border-zinc-700 pl-2">
                  Learning Without Limits
                </span>
              </div>
            </Link>

            {/* Quick Feature & Course Search Trigger */}
            <button
              type="button"
              onClick={() => setFeatureDrawerOpen(true)}
              className="hidden md:inline-flex items-center space-x-2 px-3 py-1.5 ml-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search features & courses...</span>
              <kbd className="text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded font-mono font-medium shadow-2xs">Ctrl K</kbd>
            </button>
          </div>

          {/* Right: Theme Toggle, Language Selector & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Strict 2-Language Selector (EN / हिन्दी) */}
            <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition ${
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
                className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'hi'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Strict 2-Theme Toggle (Light / Dark) */}
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

            {/* Auth Profile or Action Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-zinc-300 dark:border-zinc-800">
                <Link
                  to="/student/profile"
                  className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs border border-zinc-300 dark:border-zinc-700">
                    {user.name.charAt(0).toUpperCase()}
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
              <div className="flex items-center space-x-1.5 sm:space-x-2 pl-1 sm:pl-2 border-l border-zinc-300 dark:border-zinc-800">
                <Link
                  to="/login"
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-black hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-200 rounded-lg shadow-xs transition"
                >
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Universal 3-Line Feature Menu Drawer (Accessible across all screen sizes) */}
      <FeatureMenuDrawer
        isOpen={featureDrawerOpen}
        onClose={() => setFeatureDrawerOpen(false)}
      />
    </nav>
  );
};
