import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  X,
  Search,
  BookOpen,
  GraduationCap,
  Video,
  HelpCircle,
  Settings,
  Award,
  Users,
  Shield,
  DollarSign,
  Activity,
  Wrench,
  MessageSquare,
  Laptop,
  FileText,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  LogOut,
  LogIn,
  UserPlus,
  Sliders,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface FeatureMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  category: 'LEARNING' | 'STUDENT' | 'GOVERNANCE' | 'FACULTY' | 'SYSTEM';
  requiresAuth?: boolean;
  requiredRole?: string[];
}

const ALL_FEATURES: FeatureItem[] = [
  // 1. Learning & Academics
  {
    id: 'feat_courses',
    title: 'Course Catalogue',
    description: 'Explore verified engineering, cloud & systems programs',
    path: '/courses',
    icon: BookOpen,
    category: 'LEARNING',
  },
  {
    id: 'feat_dashboard',
    title: 'Student Learning Hub',
    description: 'Track modular progress, study discipline & goals',
    path: '/student/dashboard',
    icon: GraduationCap,
    badge: 'Core',
    category: 'LEARNING',
    requiresAuth: true,
  },
  {
    id: 'feat_classroom',
    title: 'Virtual Classroom & Lab',
    description: 'Interactive lecture playback and code sandbox',
    path: '/student/classroom/course_fullstack_ts',
    icon: PlayCircle,
    category: 'LEARNING',
    requiresAuth: true,
  },
  {
    id: 'feat_live',
    title: 'Live Masterclasses',
    description: 'WebRTC video masterclasses & cohort streaming',
    path: '/student/live-classes',
    icon: Video,
    badge: 'Live',
    category: 'LEARNING',
    requiresAuth: true,
  },
  {
    id: 'feat_doubts',
    title: 'Doubt Mentorship Hub',
    description: 'Ask faculty questions and receive mentor guidance',
    path: '/student/doubts',
    icon: MessageSquare,
    category: 'LEARNING',
    requiresAuth: true,
  },
  {
    id: 'feat_verify',
    title: 'Verify Certificate Registry',
    description: 'Cryptographically signed credential verification',
    path: '/verify-certificate',
    icon: Award,
    badge: 'QR Signed',
    category: 'LEARNING',
  },

  // 2. Student Center & Account
  {
    id: 'feat_profile',
    title: 'Student Profile & Bio',
    description: 'Academic standing, college & credential portfolio',
    path: '/student/profile',
    icon: Users,
    category: 'STUDENT',
    requiresAuth: true,
  },
  {
    id: 'feat_orders',
    title: 'Orders & Invoices',
    description: 'Payment receipts, transaction history & refunds',
    path: '/student/orders',
    icon: DollarSign,
    category: 'STUDENT',
    requiresAuth: true,
  },
  {
    id: 'feat_settings',
    title: 'Account Settings & Devices',
    description: 'Single-session token protection & notifications',
    path: '/settings',
    icon: Settings,
    category: 'STUDENT',
  },
  {
    id: 'feat_help',
    title: 'Help Center & Support',
    description: 'Search knowledge base & submit support inquiries',
    path: '/help',
    icon: HelpCircle,
    category: 'STUDENT',
  },
  {
    id: 'feat_feedback',
    title: 'Platform Feedback',
    description: 'Share feedback directly with the academic board',
    path: '/feedback',
    icon: FileText,
    category: 'STUDENT',
  },

  // 3. Administrative Governance & PRD Compliance
  {
    id: 'feat_admin_dash',
    title: 'Admin Governance Console',
    description: 'Real-time KPIs, revenue & operational metrics',
    path: '/admin/dashboard',
    icon: Activity,
    badge: 'Admin',
    category: 'GOVERNANCE',
  },
  {
    id: 'feat_admin_users',
    title: 'User Management & Dossier',
    description: 'Create, block, delete users, assign ops & inspect logs',
    path: '/admin/users',
    icon: Users,
    badge: 'RBAC',
    category: 'GOVERNANCE',
  },
  {
    id: 'feat_curriculum_studio',
    title: 'Curriculum & Course Studio',
    description: 'Configure course attributes, pricing & lifecycle status',
    path: '/content/courses',
    icon: Sliders,
    category: 'GOVERNANCE',
  },
  {
    id: 'feat_audit_logs',
    title: 'Audit & Compliance Logs',
    description: 'Append-only ledger of authentication & security events',
    path: '/admin/audit-logs',
    icon: ShieldCheck,
    category: 'GOVERNANCE',
  },
  {
    id: 'feat_maintenance',
    title: 'Maintenance Switchboards',
    description: 'Manage downtime banners and emergency feature flags',
    path: '/admin/maintenance',
    icon: Wrench,
    category: 'GOVERNANCE',
  },
  {
    id: 'feat_webhooks',
    title: 'Webhook Simulator & Health',
    description: 'Idempotent webhook testing and gateway diagnostics',
    path: '/admin/webhooks',
    icon: Laptop,
    category: 'GOVERNANCE',
  },

  // 4. Specialized Portals
  {
    id: 'feat_mentor_dash',
    title: 'Mentor Faculty Workspace',
    description: 'Live cohort hosting and curriculum oversight',
    path: '/mentor/dashboard',
    icon: GraduationCap,
    category: 'FACULTY',
  },
  {
    id: 'feat_mentor_doubts',
    title: 'Faculty Doubt Resolution Queue',
    description: 'Answer technical doubt tickets from learners',
    path: '/mentor/doubts',
    icon: MessageSquare,
    category: 'FACULTY',
  },
  {
    id: 'feat_finance_dash',
    title: 'Finance & Merchant Settlements',
    description: 'Revenue recognition, ledger balance & dispute audits',
    path: '/finance/dashboard',
    icon: DollarSign,
    category: 'FACULTY',
  },
  {
    id: 'feat_moderator_queue',
    title: 'Community Moderation Queue',
    description: 'Spam purge, DMCA standards & content reviews',
    path: '/moderator/queue',
    icon: Shield,
    category: 'FACULTY',
  },
];

export const FeatureMenuDrawer: React.FC<FeatureMenuDrawerProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout, switchDemoUser } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filtered features
  const filteredFeatures = useMemo(() => {
    return ALL_FEATURES.filter((f) => {
      if (selectedCategory !== 'ALL' && f.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = f.title.toLowerCase().includes(q);
        const matchDesc = f.description.toLowerCase().includes(q);
        const matchBadge = f.badge?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBadge) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-8 sm:pr-14">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-sm shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Ken Classes Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                  <span>Ken Classes</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 uppercase">
                    All Features
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Universal Navigation & Platform Services
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
              aria-label="Close feature menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick User Card / Sign-in Bar */}
          <div className="px-4 py-3 bg-zinc-100/60 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center space-x-1.5">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  Have an account or new learner?
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs font-bold border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-zinc-900 dark:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg shadow-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
                  >
                    Join Free
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g. users, classroom, live, audit)..."
                className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs focus:bg-white dark:focus:bg-black focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: 'ALL', label: 'All Services' },
                { id: 'LEARNING', label: 'Academics' },
                { id: 'STUDENT', label: 'Student Center' },
                { id: 'GOVERNANCE', label: 'Admin Governance' },
                { id: 'FACULTY', label: 'Portals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredFeatures.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs space-y-1">
                <Search className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <div className="font-semibold text-zinc-700 dark:text-zinc-300">No features found</div>
                <div>Try a different search keyword like "course", "admin", or "cert".</div>
              </div>
            ) : (
              filteredFeatures.map((feat) => {
                const IconComponent = feat.icon;
                const isCurrent = location.pathname === feat.path;

                return (
                  <button
                    key={feat.id}
                    onClick={() => handleNavigate(feat.path)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-start space-x-3.5 group cursor-pointer ${
                      isCurrent
                        ? 'bg-zinc-100 dark:bg-zinc-900/80 border-zinc-400 dark:border-zinc-600 shadow-xs'
                        : 'bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isCurrent
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                          {feat.title}
                        </span>
                        {feat.badge && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 ml-2">
                            {feat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {feat.description}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition shrink-0 self-center" />
                  </button>
                );
              })
            )}

            {/* Quick Demo Role Switcher Section */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Quick Demo Role Switcher
                </span>
                <span className="text-[10px] text-zinc-400">1-Click Instant Login</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { role: 'Student', email: 'student@auralms.io' },
                  { role: 'Mentor', email: 'mentor@auralms.io' },
                  { role: 'Content QA', email: 'content@auralms.io' },
                  { role: 'Finance', email: 'finance@auralms.io' },
                  { role: 'Moderator', email: 'moderator@auralms.io' },
                  { role: 'Admin', email: 'admin@auralms.io' },
                ].map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onClose();
                      switchDemoUser(r.email);
                    }}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-center"
                  >
                    {r.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls: Language & Theme */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between text-xs">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  language === 'en'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  language === 'hi'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
