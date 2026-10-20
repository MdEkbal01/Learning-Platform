import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, GraduationCap, DollarSign, PenTool, Flame } from 'lucide-react';

const rolesList = [
  { label: 'Student', email: 'student@lms.local', role: 'STUDENT', icon: GraduationCap, color: 'bg-blue-600', path: '/student/dashboard' },
  { label: 'Mentor', email: 'mentor@lms.local', role: 'MENTOR', icon: BookOpen, color: 'bg-indigo-600', path: '/mentor/dashboard' },
  { label: 'Content Mgr', email: 'content@lms.local', role: 'CONTENT_MANAGER', icon: PenTool, color: 'bg-amber-600', path: '/content/courses' },
  { label: 'Finance', email: 'finance@lms.local', role: 'FINANCE_SUPPORT', icon: DollarSign, color: 'bg-emerald-600', path: '/finance/dashboard' },
  { label: 'Moderator', email: 'moderator@lms.local', role: 'MODERATOR', icon: Shield, color: 'bg-rose-600', path: '/moderator/queue' },
  { label: 'Admin', email: 'admin@lms.local', role: 'SUPER_ADMIN', icon: Flame, color: 'bg-purple-600', path: '/admin/dashboard' },
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
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <span className="font-semibold text-slate-300">Quick Role Switcher:</span>
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
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  isCurrent
                    ? `${r.color} text-white shadow-sm ring-2 ring-white/20`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${r.label} (${r.email})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
