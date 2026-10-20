import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Plus,
  Edit,
  Award,
  BookOpen,
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Role Modal
  const [roleModalUser, setRoleModalUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('STUDENT');
  const [roleReason, setRoleReason] = useState('');

  // Status Modal
  const [statusModalUser, setStatusModalUser] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState('ACTIVE');
  const [suspensionReason, setSuspensionReason] = useState('');

  // Manual Grant Modal
  const [grantModalUser, setGrantModalUser] = useState<any>(null);
  const [grantCourseId, setGrantCourseId] = useState('');
  const [grantAction, setGrantAction] = useState('GRANT');
  const [grantReason, setGrantReason] = useState('');

  const fetchUsers = async () => {
    try {
      const [uRes, cRes] = await Promise.all([
        api.get(`/admin/users?role=${roleFilter}&status=${statusFilter}&search=${search}`),
        api.get('/content/courses'),
      ]);
      setUsers(uRes.data);
      setCourses(cRes.data);
      if (cRes.data.length > 0) {
        setGrantCourseId(cRes.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search]);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    try {
      await api.patch(`/admin/users/${roleModalUser.id}/role`, {
        newRole,
        reason: roleReason || 'Administrative promotion',
      });
      setRoleModalUser(null);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Role change failed.');
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalUser) return;
    try {
      await api.patch(`/admin/users/${statusModalUser.id}/status`, {
        status: targetStatus,
        reason: suspensionReason,
      });
      setStatusModalUser(null);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Status change failed.');
    }
  };

  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModalUser || !grantCourseId) return;
    try {
      await api.post('/admin/enrolments/manual', {
        userId: grantModalUser.id,
        courseId: grantCourseId,
        action: grantAction,
        reason: grantReason,
      });
      setGrantModalUser(null);
      fetchUsers();
      alert(`Course access ${grantAction === 'GRANT' ? 'granted' : 'revoked'} successfully.`);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Manual grant failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <div className="text-xs uppercase font-bold text-purple-600 tracking-wider">Access Governance</div>
        <h1 className="text-2xl font-black text-slate-900 mt-0.5">User Accounts & RBAC Roles Directory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Assign role privileges, manage account status, and authorize manual course entitlements.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or username..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="CONTENT_MANAGER">Content Manager</option>
            <option value="FINANCE_SUPPORT">Finance & Support</option>
            <option value="MODERATOR">Moderator</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Enrolments</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{u._count?.enrolments || 0} courses</td>
                  <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => {
                          setRoleModalUser(u);
                          setNewRole(u.role);
                          setRoleReason('');
                        }}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-xs transition"
                        title="Change Role"
                      >
                        Change Role
                      </button>

                      <button
                        onClick={() => {
                          setGrantModalUser(u);
                          setGrantReason('Scholarship award / administrative grant');
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition"
                        title="Manual Course Access"
                      >
                        Grant Access
                      </button>

                      <button
                        onClick={() => {
                          setStatusModalUser(u);
                          setTargetStatus(u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                          setSuspensionReason(u.status === 'ACTIVE' ? 'Policy violation / spam activity.' : '');
                        }}
                        className={`px-2.5 py-1 font-bold rounded-lg text-xs transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Change User Privilege Role</h3>
            <p className="text-xs text-slate-500">
              Target User: <strong className="text-slate-800">{roleModalUser.name}</strong> ({roleModalUser.email})
            </p>

            <form onSubmit={handleUpdateRole} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="STUDENT">Student</option>
                  <option value="MENTOR">Mentor / Lecturer</option>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="FINANCE_SUPPORT">Finance & Support Staff</option>
                  <option value="MODERATOR">Community Moderator</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Change *</label>
                <input
                  type="text"
                  required
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  placeholder="e.g. Appointed faculty mentor for Web Dev"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Confirm Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Status Modal (Suspend / Reactivate) */}
      {statusModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {targetStatus === 'SUSPENDED' ? 'Suspend User Account' : 'Reactivate User Account'}
            </h3>
            <p className="text-xs text-slate-500">
              PRD ADM-03 Compliance: Suspending an account will immediately invalidate all active sessions and log an audit reason.
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              {targetStatus === 'SUSPENDED' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Documented Reason *</label>
                  <textarea
                    rows={3}
                    required
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    placeholder="Provide specific justification..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalUser(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-white text-xs font-bold rounded-lg transition ${
                    targetStatus === 'SUSPENDED' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Confirm {targetStatus}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Course Grant Modal */}
      {grantModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Authorize Manual Course Access</h3>
            <p className="text-xs text-slate-500">
              PRD ADM-09: Grant or revoke course entitlement for {grantModalUser.name}.
            </p>

            <form onSubmit={handleManualGrant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action</label>
                <select
                  value={grantAction}
                  onChange={(e) => setGrantAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="GRANT">Grant Access (Activate Enrolment)</option>
                  <option value="REVOKE">Revoke Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={grantCourseId}
                  onChange={(e) => setGrantCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} (${c.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Audit Justification *</label>
                <input
                  type="text"
                  required
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="e.g. Scholarship waiver approved"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGrantModalUser(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Execute Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
