import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  Palette,
  Languages,
  Bell,
  User,
  Shield,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  KeyRound,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { theme, setTheme, language, setLanguage, t } = useThemeLanguage();

  const [activeTab, setActiveTab] = useState<'appearance' | 'language' | 'notifications' | 'profile' | 'sessions'>('appearance');

  // Notifications State
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    doubts: true,
    announcements: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState<string | null>(null);

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.profile?.college || '');
  const [academicYear, setAcademicYear] = useState(user?.profile?.academicYear || '1st Year');
  const [academicCourse, setAcademicCourse] = useState(user?.profile?.academicCourse || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Load preferences
  useEffect(() => {
    if (user) {
      setName(user.name);
      setCollege(user.profile?.college || '');
      setAcademicYear(user.profile?.academicYear || '1st Year');
      setAcademicCourse(user.profile?.academicCourse || '');
      setBio(user.profile?.bio || '');

      api
        .get('/preferences')
        .then((res) => {
          if (res.data?.notificationPrefs) {
            setNotificationPrefs(res.data.notificationPrefs);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Load sessions when tab opened
  useEffect(() => {
    if (activeTab === 'sessions' && user) {
      loadSessions();
    }
  }, [activeTab, user]);

  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const res = await api.get('/auth/sessions');
      setSessions(res.data);
    } catch {
      // Ignored
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      loadSessions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to revoke session');
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifSuccess(null);
    try {
      await api.put('/preferences', { notificationPrefs });
      setNotifSuccess(t('saveSuccess'));
      setTimeout(() => setNotifSuccess(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update notification preferences');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await api.put('/auth/profile', {
        name,
        college,
        academicYear,
        academicCourse,
        bio,
      });
      await refreshUser();
      setProfileMessage(t('saveSuccess'));
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setPwdLoading(true);
    setPwdMessage(null);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setPwdMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMessage(null), 4000);
    } catch (err: any) {
      setPwdMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update password. Check your current password.',
      });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {t('accountSettings')}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
          {t('settingsSubtitle')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-64 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-xs shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'appearance'
                  ? 'bg-black dark:bg-white text-white dark:text-black text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>{t('appearanceTab')}</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'language'
                  ? 'bg-black dark:bg-white text-white dark:text-black text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Languages className="w-4 h-4 shrink-0" />
              <span>{t('languageTab')}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'notifications'
                  ? 'bg-black dark:bg-white text-white dark:text-black text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>{t('notificationsTab')}</span>
            </button>

            {user && (
              <>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'profile'
                      ? 'bg-black dark:bg-white text-white dark:text-black text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>{t('profileTab')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'sessions'
                      ? 'bg-black dark:bg-white text-white dark:text-black text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Laptop className="w-4 h-4 shrink-0" />
                  <span>{t('sessionsTab')}</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
          {/* 1. APPEARANCE & THEME (PREF-01 to PREF-04) */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span>{t('appearanceTab')}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t('themeDescription')}
                </p>
              </div>

              {/* Exact 2-Theme Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Light Theme Card */}
                <div
                  onClick={() => setTheme('light')}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition relative flex flex-col justify-between ${
                    theme === 'light'
                      ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/20 shadow-md ring-2 ring-zinc-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                            {t('lightTheme')}
                          </h3>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Standard High-Clarity
                          </span>
                        </div>
                      </div>
                      {theme === 'light' && (
                        <span className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    {/* Visual Miniature Mockup */}
                    <div className="mt-3 bg-white border border-zinc-200 rounded-xl p-3 space-y-2 shadow-xs">
                      <div className="h-2 w-16 bg-black dark:bg-white text-white dark:text-black rounded-full" />
                      <div className="h-2 w-28 bg-zinc-200 rounded-full" />
                      <div className="flex space-x-1.5 pt-1">
                        <div className="h-4 w-12 bg-zinc-100 rounded-md" />
                        <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-4">
                    Optimal readability in standard lit workspaces. Strict WCAG AA compliant.
                  </p>
                </div>

                {/* Dark Theme Card */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition relative flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/20 shadow-md ring-2 ring-zinc-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 text-zinc-100 flex items-center justify-center">
                          <Moon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                            {t('darkTheme')}
                          </h3>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            High-Contrast Midnight
                          </span>
                        </div>
                      </div>
                      {theme === 'dark' && (
                        <span className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    {/* Visual Miniature Mockup */}
                    <div className="mt-3 bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2 shadow-xs">
                      <div className="h-2 w-16 bg-zinc-300 dark:bg-white rounded-full" />
                      <div className="h-2 w-28 bg-zinc-700 rounded-full" />
                      <div className="flex space-x-1.5 pt-1">
                        <div className="h-4 w-12 bg-zinc-800 rounded-md" />
                        <div className="h-4 w-12 bg-zinc-900 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-4">
                    Engineered to reduce eye fatigue during extended night study sessions.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 dark:text-zinc-900 dark:text-zinc-100 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-zinc-900 dark:text-white" />
                <span>
                  <strong>PREF-03 / PREF-04 Compliance:</strong> Theme transitions apply immediately across the active screen without triggering full page reloads or erasing form inputs. Preferences persist across guest sessions and sync to your learner profile when signed in.
                </span>
              </div>
            </div>
          )}

          {/* 2. LANGUAGE PREFERENCE (LANG-01 to LANG-06) */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span>{t('languageTab')}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t('langDescription')}
                </p>
              </div>

              {/* Exact 2-Language Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* English Card */}
                <div
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition flex flex-col justify-between ${
                    language === 'en'
                      ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/20 shadow-md ring-2 ring-zinc-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-950/60 text-zinc-900 dark:text-white font-bold flex items-center justify-center text-sm">
                          EN
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                            English
                          </h3>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            International (EN)
                          </span>
                        </div>
                      </div>
                      {language === 'en' && (
                        <span className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      All platform navigation, module instructions, assessments, certificates, and system dialogues will render in English.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 dark:text-zinc-400">
                    HTML Lang Tag: <code className="text-zinc-900 dark:text-white font-mono">lang="en"</code>
                  </div>
                </div>

                {/* Hindi Card */}
                <div
                  onClick={() => setLanguage('hi')}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition flex flex-col justify-between ${
                    language === 'hi'
                      ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/20 shadow-md ring-2 ring-zinc-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-sm">
                          हिं
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                            हिन्दी (Hindi)
                          </h3>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            National / Regional (HI)
                          </span>
                        </div>
                      </div>
                      {language === 'hi' && (
                        <span className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      समस्त प्लेटफ़ॉर्म नेविगेशन, मॉड्यूल निर्देश, सहायता केंद्र और महत्वपूर्ण अलर्ट हिन्दी में प्रदर्शित होंगे।
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 dark:text-zinc-400">
                    HTML Lang Tag: <code className="text-zinc-900 dark:text-white font-mono">lang="hi"</code>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>LANG-05 / LANG-06 Compliance:</strong> Language changes take effect instantly across all loaded components without losing test responses, draft doubt submissions, or navigation breadcrumbs. The root document accessibility attribute is updated automatically for screen readers.
                </span>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span>{t('notificationsTab')}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Choose how and when AuraLMS notifies you about academic milestones and discussions.
                </p>
              </div>

              {notifSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{notifSuccess}</span>
                </div>
              )}

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* Email Notifications */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {t('emailNotifications')}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('emailNotificationsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.email}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, email: e.target.checked })
                    }
                    className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded-sm focus:ring-zinc-900 dark:focus:ring-white border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  />
                </div>

                {/* SMS Notifications */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {t('smsNotifications')}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('smsNotificationsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.sms}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, sms: e.target.checked })
                    }
                    className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded-sm focus:ring-zinc-900 dark:focus:ring-white border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  />
                </div>

                {/* Doubt Notifications */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {t('doubtNotifications')}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('doubtNotificationsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.doubts}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, doubts: e.target.checked })
                    }
                    className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded-sm focus:ring-zinc-900 dark:focus:ring-white border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  />
                </div>

                {/* Announcement Notifications */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {t('announcementNotifications')}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('announcementNotificationsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.announcements}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, announcements: e.target.checked })
                    }
                    className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded-sm focus:ring-zinc-900 dark:focus:ring-white border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={notifLoading}
                className="px-5 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {notifLoading ? 'Saving...' : t('savePreferences')}
              </button>
            </form>
          )}

          {/* 4. PROFILE & SECURITY */}
          {activeTab === 'profile' && user && (
            <div className="space-y-8">
              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-zinc-900 dark:text-white" />
                    <span>{t('personalInfo')}</span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Keep your institutional affiliation and personal contact details current.
                  </p>
                </div>

                {profileMessage && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('collegeUniversity')}
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Indian Institute of Technology"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('academicYear')}
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Alumni / Professional">Alumni / Working Professional</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('degreeProgram')}
                    </label>
                    <input
                      type="text"
                      value={academicCourse}
                      onChange={(e) => setAcademicCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science & Engineering"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('bio')}
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief note about your engineering interests or aspirations..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : t('saveChanges')}
                </button>
              </form>

              {/* Password Change Form */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                      <KeyRound className="w-4 h-4 text-zinc-900 dark:text-white" />
                      <span>{t('changePassword')}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Ensure your account uses a secure password of at least 8 characters.
                    </p>
                  </div>

                  {pwdMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                        pwdMessage.type === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {pwdMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{pwdMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('currentPassword')}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('newPassword')}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('confirmPassword')}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-4 py-2 bg-zinc-800 dark:bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    {pwdLoading ? 'Updating...' : t('updatePassword')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 5. ACTIVE SESSIONS */}
          {activeTab === 'sessions' && user && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                  <Laptop className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span>{t('sessionsTab')}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Review logged-in browsers and devices associated with your credentials.
                </p>
              </div>

              {sessionsLoading ? (
                <div className="text-center py-8 text-xs text-zinc-400">Loading active sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No other active sessions recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-950/40 text-zinc-900 dark:text-white flex items-center justify-center">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {session.userAgent || 'Web Browser'}
                            </span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                Current Device
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            IP: {session.ipAddress} • Logged in:{' '}
                            {new Date(session.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
