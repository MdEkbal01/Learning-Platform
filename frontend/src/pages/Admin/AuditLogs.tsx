import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/admin/audit-logs?search=${search}&action=${actionFilter}&limit=100`);
      setLogs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <div className="text-xs uppercase font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">Security & Compliance</div>
        <h1 className="text-2xl font-black text-zinc-900 mt-0.5">Platform Security Audit Log Trail</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Immutable, timestamped audit log of all sign-ins, role updates, refunds, access grants, and system events (PRD ADM-05).
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, email, details..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-700"
        >
          <option value="ALL">All Event Actions</option>
          <option value="USER_LOGIN">USER_LOGIN</option>
          <option value="USER_REGISTERED">USER_REGISTERED</option>
          <option value="USER_ROLE_CHANGED">USER_ROLE_CHANGED</option>
          <option value="USER_SUSPENDED">USER_SUSPENDED</option>
          <option value="USER_REACTIVATED">USER_REACTIVATED</option>
          <option value="PAYMENT_VERIFIED_AND_ENROLLED">PAYMENT_VERIFIED_AND_ENROLLED</option>
          <option value="ORDER_REFUNDED_AND_ACCESS_REVOKED">ORDER_REFUNDED_AND_ACCESS_REVOKED</option>
          <option value="MANUAL_ENROLMENT_GRANTED">MANUAL_ENROLMENT_GRANTED</option>
          <option value="COURSE_STATUS_CHANGED">COURSE_STATUS_CHANGED</option>
          <option value="MAINTENANCE_FLAG_TOGGLED">MAINTENANCE_FLAG_TOGGLED</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Entity</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-zinc-50/80 transition">
                      <td className="p-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[11px] border border-zinc-300 dark:border-zinc-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-zinc-900">{log.actor?.name || log.actorEmail || 'System'}</div>
                        <div className="text-[11px] text-zinc-400">{log.actor?.role || 'SYSTEM'}</div>
                      </td>
                      <td className="p-4 text-zinc-600 font-mono text-[11px]">
                        {log.entityType} {log.entityId ? `(${log.entityId.substring(0, 8)})` : ''}
                      </td>
                      <td className="p-4 text-zinc-500 font-mono text-[11px]">{log.ipAddress}</td>
                      <td className="p-4 text-zinc-400 text-[11px]">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        {log.detailsJson && (
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:text-zinc-100 font-bold text-xs"
                          >
                            {isExpanded ? 'Hide' : 'Inspect'}
                          </button>
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-zinc-50">
                        <td colSpan={6} className="p-4 text-xs font-mono">
                          <div className="bg-zinc-900 text-emerald-400 p-3 rounded-xl overflow-x-auto">
                            <pre>{JSON.stringify(JSON.parse(log.detailsJson), null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
