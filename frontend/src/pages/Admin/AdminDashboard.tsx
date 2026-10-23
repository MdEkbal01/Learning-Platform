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
  Sliders,
  Terminal,
  Video,
  HelpCircle,
  Award,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(() => ({
    metrics: {
      totalStudents: 1420,
      totalRevenue: 18500,
      totalCourses: 12,
      activeEnrolments: 3840,
      completionRate: 88,
      avgSatisfaction: 4.9,
    },
    retentionRate: '94.2%',
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
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
            <span className="text-[11px] uppercase font-extrabold text-zinc-900 dark:text-white tracking-wider bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 dark:border-zinc-300 dark:border-zinc-700">
              Super Administrator
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Live Governance Node
            </span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tight">
            Platform Operations & Control Center
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Global governance, least-privilege security oversight, user management, and audit verification.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 transition shadow-xs"
          >
            Users & Roles
          </Link>
          <Link
            to="/admin/maintenance"
            className="px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 transition shadow-xs"
          >
            Maintenance Switches
          </Link>
          <Link
            to="/admin/simulator"
            className="px-4 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
          >
            Webhook Simulator
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid with Trend Indicators */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/60 text-zinc-900 dark:text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{m?.totalUsers || 0}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
              {m?.studentsCount || 0} Students • {m?.mentorsCount || 0} Mentors
            </div>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +28.5%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">₹{(m?.totalRevenue || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
              Platform Gross Revenue (INR)
            </div>
          </div>
        </div>

        {/* Published Courses */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-black/60 text-zinc-900 dark:text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
              {Math.round(((m?.publishedCourses || 0) / (m?.totalCourses || 1)) * 100)}% Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {m?.publishedCourses || 0} / {m?.totalCourses || 0}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
              Published / Total Syllabi
            </div>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              Action Queue
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">{m?.pendingReports || 0}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
              Pending Reports in Queue
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: SVG Revenue Area Chart (2/3) + RBAC Distribution (1/3) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* SVG Area Line Chart */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-zinc-900 dark:text-white" />
                <span>Gross Revenue & Enrolment Velocity</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Monthly revenue trajectory across May - October 2026.
              </p>
            </div>
            {activeChartPoint !== null && (
              <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:border-zinc-300 dark:border-zinc-700">
                {revenueHistory[activeChartPoint].month}: ₹{revenueHistory[activeChartPoint].rev.toLocaleString('en-IN')} (
                {revenueHistory[activeChartPoint].enrolments} enrollments)
              </div>
            )}
          </div>

          {/* Responsive SVG Area Chart */}
          <div className="relative w-full h-52">
            <svg viewBox="0 0 460 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="10" y1="30" x2="450" y2="30" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="3 3" />
              <line x1="10" y1="70" x2="450" y2="70" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="3 3" />
              <line x1="10" y1="110" x2="450" y2="110" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="3 3" />
              <line x1="10" y1="150" x2="450" y2="150" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />

              {/* Smooth Area Path */}
              <path
                d="M 20 130 C 60 115, 80 110, 100 105 C 140 95, 160 90, 180 85 C 220 75, 240 70, 260 65 C 300 50, 320 45, 340 40 C 380 28, 400 24, 420 20 L 420 150 L 20 150 Z"
                fill="url(#areaGradient)"
              />

              {/* Smooth Stroke Line */}
              <path
                d="M 20 130 C 60 115, 80 110, 100 105 C 140 95, 160 90, 180 85 C 220 75, 240 70, 260 65 C 300 50, 320 45, 340 40 C 380 28, 400 24, 420 20"
                fill="none"
                stroke="currentColor" className="text-zinc-900 dark:text-white"
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
                    className="fill-white dark:fill-zinc-900 stroke-black dark:stroke-white transition-all duration-200"
                    strokeWidth="3"
                  />
                  <text
                    x={p.x}
                    y={162}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-zinc-400 dark:fill-zinc-500"
                  >
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* RBAC Role Distribution */}
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>Role Distribution</span>
            </h3>
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">
              6 Roles
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Students', count: m?.studentsCount || 5, color: 'bg-black dark:bg-white text-white dark:text-black', percent: 65 },
              { label: 'Mentors', count: m?.mentorsCount || 1, color: 'bg-black dark:bg-white text-white dark:text-black', percent: 12 },
              { label: 'Content Mgrs', count: 1, color: 'bg-amber-500', percent: 8 },
              { label: 'Finance Staff', count: 1, color: 'bg-emerald-500', percent: 6 },
              { label: 'Moderators', count: 1, color: 'bg-rose-500', percent: 5 },
              { label: 'Super Admins', count: 1, color: 'bg-black dark:bg-white text-white dark:text-black', percent: 4 },
            ].map((role) => (
              <div key={role.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${role.color}`} />
                    <span>{role.label}</span>
                  </span>
                  <span className="font-mono text-zinc-500 dark:text-zinc-400">{role.count}</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden">
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

      {/* PRD Multi-Domain Operations Suite (Universal Admin Access) */}
      <div className="relative z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                PRD Multi-Domain Operational Governance Suite
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Super Admin universal access matrix per Section 2 of PRD v2.0. Full operational authority across every platform domain.
            </p>
          </div>
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 self-start sm:self-auto">
            10 Functional Domains Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Curriculum & Authoring Studio',
              path: '/content/courses',
              icon: BookOpen,
              desc: 'Author courses, organize multi-tiered syllabi, configure quizzes, and execute Draft → Publish workflow.',
              spec: 'PRD CRS-01 - 04',
            },
            {
              title: 'Financial Ledgers & Refunds',
              path: '/finance/dashboard',
              icon: DollarSign,
              desc: 'Inspect gross revenue velocity, reconcile orders, process student refunds, and audit ledger balances.',
              spec: 'PRD PAY-01 - 04',
            },
            {
              title: 'Community Moderation Queue',
              path: '/moderator/queue',
              icon: ShieldAlert,
              desc: 'Triage flagged forum posts, moderate academic discussions, and maintain community safety standards.',
              spec: 'PRD ADM-04',
            },
            {
              title: 'User & Identity Governance',
              path: '/admin/users',
              icon: Users,
              desc: 'Manage multi-role RBAC permissions, process mandatory reason suspensions, and grant manual course access.',
              spec: 'PRD AUTH-07 & ADM-02',
            },
            {
              title: 'Doubt Ticket Queue & Support',
              path: '/mentor/doubts',
              icon: HelpCircle,
              desc: 'Inspect student technical doubt inquiries, analyze attachments, and provide mentor architectural solutions.',
              spec: 'PRD COM-01 - 03',
            },
            {
              title: 'Live Masterclasses & Broadcasts',
              path: '/student/live-classes',
              icon: Video,
              desc: 'Schedule and inspect live streaming masterclasses, interactive video rooms, and authenticated participant links.',
              spec: 'PRD COM-04',
            },
            {
              title: 'Student Learning & Classroom Hub',
              path: '/student/dashboard',
              icon: Layers,
              desc: 'Experience the learner perspective, verify lesson progression, test quizzes, and inspect video streaming.',
              spec: 'PRD STU-01 - 04',
            },
            {
              title: 'Feature Maintenance Switches',
              path: '/admin/maintenance',
              icon: Sliders,
              desc: 'Gracefully isolate specific features (checkout, forum, live streams) with friendly user banners without downtime.',
              spec: 'PRD ADM-02',
            },
            {
              title: 'Gateway Sandbox & Simulator',
              path: '/admin/simulator',
              icon: Terminal,
              desc: 'Test asynchronous server-to-server webhook callbacks and verify duplicate callback idempotency defense.',
              spec: 'PRD PAY-02',
            },
            {
              title: 'Digital Certificate Registry',
              path: '/verify-certificate',
              icon: Award,
              desc: 'Verify cryptographically signed student completion credentials, signature hashes, and public registry lookups.',
              spec: 'PRD CERT-01',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      {item.spec}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:underline">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-[11px] font-semibold text-zinc-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                  <span>Open Domain</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Real-Time Security & Audit Event Stream (PRD ADM-05) */}
      <div className="relative z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Real-Time Security & Audit Event Stream
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Every sensitive and high-impact administrative action is permanently recorded.
            </p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-zinc-900 dark:text-white hover:underline flex items-center space-x-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {data?.recentAuditLogs?.map((log: any) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[11px] border border-zinc-300 dark:border-zinc-700 dark:border-zinc-300 dark:border-zinc-700">
                    {log.action}
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px]">{log.entityType}</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-300 text-xs">
                  Actor: <strong className="text-zinc-800 dark:text-white">{log.actor?.name || log.actorEmail || 'System'}</strong> ({log.actor?.role || 'SYSTEM'})
                </div>
              </div>
              <div className="text-right text-[11px] text-zinc-400 font-mono shrink-0">
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
