import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { PointerLight } from '../../components/PointerLight';
import {
  Users,
  BookOpen,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/admin/analytics')
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

  // Monthly revenue chart points for visualization (May to October)
  const revenueHistory = [
    { month: 'May', rev: 4200, enrolments: 45, x: 20, y: 130 },
    { month: 'Jun', rev: 6800, enrolments: 72, x: 100, y: 105 },
    { month: 'Jul', rev: 8900, enrolments: 95, x: 180, y: 85 },
    { month: 'Aug', rev: 11400, enrolments: 120, x: 260, y: 65 },
    { month: 'Sep', rev: 14800, enrolments: 165, x: 340, y: 40 },
    { month: 'Oct', rev: m?.totalRevenue || 18500, enrolments: 198, x: 420, y: 20 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative overflow-hidden">
      {/* CodeByGaurav signature ambient pointer light */}
      <PointerLight intensity="subtle" />

      {/* Header with Quick Actions */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-extrabold text-purple-600 dark:text-purple-400 tracking-wider bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              Super Administrator
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Live Governance Node
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Platform Operations & Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global governance, least-privilege security oversight, user management, and audit verification.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-3.5 py-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 transition shadow-xs"
          >
            Users & Roles
          </Link>
          <Link
            to="/admin/maintenance"
            className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-800 transition shadow-xs"
          >
            Maintenance Switches
          </Link>
          <Link
            to="/admin/simulator"
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Webhook Simulator
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid with Trend Indicators */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{m?.totalUsers || 0}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {m?.studentsCount || 0} Students • {m?.mentorsCount || 0} Mentors
            </div>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +28.5%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">${m?.totalRevenue || 0}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Platform Gross Revenue (USD)
            </div>
          </div>
        </div>

        {/* Published Courses */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
              {Math.round(((m?.publishedCourses || 0) / (m?.totalCourses || 1)) * 100)}% Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {m?.publishedCourses || 0} / {m?.totalCourses || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Published / Total Syllabi
            </div>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              Action Queue
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{m?.pendingReports || 0}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Pending Reports in Queue
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: SVG Revenue Area Chart (2/3) + RBAC Distribution (1/3) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* SVG Area Line Chart */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Gross Revenue & Enrolment Velocity</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly revenue trajectory across May - October 2026.
              </p>
            </div>
            {activeChartPoint !== null && (
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                {revenueHistory[activeChartPoint].month}: ${revenueHistory[activeChartPoint].rev.toLocaleString()} (
                {revenueHistory[activeChartPoint].enrolments} enrollments)
              </div>
            )}
          </div>

          {/* Responsive SVG Area Chart */}
          <div className="relative w-full h-52">
            <svg viewBox="0 0 460 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="10" y1="30" x2="450" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="10" y1="70" x2="450" y2="70" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="10" y1="110" x2="450" y2="110" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="10" y1="150" x2="450" y2="150" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

              {/* Smooth Area Path */}
              <path
                d="M 20 130 C 60 115, 80 110, 100 105 C 140 95, 160 90, 180 85 C 220 75, 240 70, 260 65 C 300 50, 320 45, 340 40 C 380 28, 400 24, 420 20 L 420 150 L 20 150 Z"
                fill="url(#areaGradient)"
              />

              {/* Smooth Stroke Line */}
              <path
                d="M 20 130 C 60 115, 80 110, 100 105 C 140 95, 160 90, 180 85 C 220 75, 240 70, 260 65 C 300 50, 320 45, 340 40 C 380 28, 400 24, 420 20"
                fill="none"
                stroke="#9333ea"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Markers */}
              {revenueHistory.map((p, idx) => (
                <g
                  key={p.month}
                  onMouseEnter={() => setActiveChartPoint(idx)}
                  onMouseLeave={() => setActiveChartPoint(null)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeChartPoint === idx ? 7 : 4.5}
                    className="fill-white dark:fill-slate-900 stroke-purple-600 transition-all duration-200"
                    strokeWidth="3"
                  />
                  <text
                    x={p.x}
                    y={162}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                  >
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* RBAC Role Distribution */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Role Distribution</span>
            </h3>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
              6 Roles
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Students', count: m?.studentsCount || 5, color: 'bg-blue-500', percent: 65 },
              { label: 'Mentors', count: m?.mentorsCount || 1, color: 'bg-indigo-500', percent: 12 },
              { label: 'Content Mgrs', count: 1, color: 'bg-amber-500', percent: 8 },
              { label: 'Finance Staff', count: 1, color: 'bg-emerald-500', percent: 6 },
              { label: 'Moderators', count: 1, color: 'bg-rose-500', percent: 5 },
              { label: 'Super Admins', count: 1, color: 'bg-purple-600', percent: 4 },
            ].map((role) => (
              <div key={role.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${role.color}`} />
                    <span>{role.label}</span>
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{role.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${role.color} rounded-full transition-all duration-500`}
                    style={{ width: `${role.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Security & Audit Event Stream (PRD ADM-05) */}
      <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Security & Audit Event Stream
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every sensitive and high-impact administrative action is permanently recorded.
            </p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data?.recentAuditLogs?.map((log: any) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded text-[11px] border border-purple-200 dark:border-purple-800">
                    {log.action}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{log.entityType}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-xs">
                  Actor: <strong className="text-slate-800 dark:text-white">{log.actor?.name || log.actorEmail || 'System'}</strong> ({log.actor?.role || 'SYSTEM'})
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
