import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, GraduationCap, DollarSign, PenTool, Flame } from 'lucide-react';

const rolesList = [
  { label: 'Student', email: 'student@lms.local', role: 'STUDENT', icon: GraduationCap, path: '/student/dashboard' },
  { label: 'Mentor', email: 'mentor@lms.local', role: 'MENTOR', icon: BookOpen, path: '/mentor/dashboard' },
  { label: 'Content Mgr', email: 'content@lms.local', role: 'CONTENT_MANAGER', icon: PenTool, path: '/content/courses' },
  { label: 'Finance', email: 'finance@lms.local', role: 'FINANCE_SUPPORT', icon: DollarSign, path: '/finance/dashboard' },
  { label: 'Moderator', email: 'moderator@lms.local', role: 'MODERATOR', icon: Shield, path: '/moderator/queue' },
  { label: 'Admin', email: 'admin@lms.local', role: 'SUPER_ADMIN', icon: Flame, path: '/admin/dashboard' },
];

export const QuickRoleSwitcher: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (email: string, targetPath: string) => {
    try {
      await switchDemoUser(email);
      navigate(targetPath);
    } catch (e) {
      console.error('Role switch failed', e);
    }
  };

  return (
    <div className="bg-zinc-100 dark:bg-black text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 text-xs py-1.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">Quick Role Switcher:</span>
          <span className="hidden sm:inline">1-click switch between demo persona accounts</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {rolesList.map((r) => {
            const isCurrent = user?.email === r.email;
            const Icon = r.icon;
            return (
              <button
                key={r.email}
                onClick={() => handleSwitch(r.email, r.path)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer border ${
                  isCurrent
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
                title={`Switch to ${r.label} (${r.email})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-current ml-0.5 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
