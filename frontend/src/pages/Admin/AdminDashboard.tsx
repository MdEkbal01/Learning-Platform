import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Users,
  BookOpen,
  DollarSign,
  HelpCircle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ToggleRight,
  Send,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get('/admin/analytics')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const m = data?.metrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-purple-600 tracking-wider">Super Administrator</div>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Platform Operations & Control Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global governance, least-privilege security oversight, user management, and audit verification.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl transition"
          >
            Manage Users & Roles
          </Link>
          <Link
            to="/admin/maintenance"
            className="px-3.5 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs rounded-xl transition"
          >
            Maintenance Switches
          </Link>
          <Link
            to="/admin/simulator"
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Webhook Simulator
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{m?.totalUsers || 0}</div>
            <div className="text-xs text-slate-500 font-medium">{m?.studentsCount || 0} Students • {m?.mentorsCount || 0} Mentors</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">${m?.totalRevenue || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Platform Revenue (USD)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{m?.publishedCourses || 0} / {m?.totalCourses || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Published / Total Courses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{m?.pendingReports || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Moderation Reports</div>
          </div>
        </div>
      </div>

      {/* Recent Audit Log Stream (PRD ADM-05) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Real-Time Security & Audit Event Stream</h2>
            <p className="text-xs text-slate-500">Every sensitive and high-impact administrative action is permanently recorded.</p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {data?.recentAuditLogs?.map((log: any) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{log.entityType}</span>
                </div>
                <div className="text-slate-600 text-xs">
                  Actor: <strong className="text-slate-800">{log.actor?.name || log.actorEmail || 'System'}</strong> ({log.actor?.role || 'SYSTEM'})
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                <div>{new Date(log.createdAt).toLocaleString()}</div>
                <div>IP: {log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
