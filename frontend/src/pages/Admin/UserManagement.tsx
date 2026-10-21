import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { MOCK_USERS, MOCK_COURSES } from '../../api/mockData';
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
  UserPlus,
  Trash2,
  Activity,
  FileText,
  Wrench,
  Sliders,
  Download,
  Printer,
  Ban,
  CheckCircle2,
  Clock,
  Laptop,
  Globe,
  RefreshCw,
  X,
} from 'lucide-react';

const MAINTENANCE_OPERATIONS = [
  {
    id: 'COMMUNITY_FORUM_MAINTENANCE',
    label: 'Community Forum Maintenance',
    description: 'Purge spam discussions, flag offensive threads, and toggle read-only mode during audits.',
  },
  {
    id: 'PAYMENT_CHECKOUT_MAINTENANCE',
    label: 'Payment Gateway & Checkout Health',
    description: 'Diagnose Razorpay/Stripe webhooks, toggle maintenance banners, and issue manual receipt overrides.',
  },
  {
    id: 'LIVE_CLASSES_MAINTENANCE',
    label: 'Live WebRTC & Masterclass Diagnostic',
    description: 'Restart live streaming rooms, diagnose participant jitter, and reset session tokens.',
  },
  {
    id: 'PLATFORM_GLOBAL_MAINTENANCE',
    label: 'Platform Emergency Maintenance Switch',
    description: 'Publish emergency maintenance alerts and manage read-only downtime banner across all pages.',
  },
  {
    id: 'CACHE_INVALIDATION',
    label: 'Edge CDN Cache & Asset Flush',
    description: 'Purge Cloudflare edge cache and invalidate stale course curricula assets instantaneously.',
  },
  {
    id: 'DATABASE_BACKUP_MONITOR',
    label: 'Database Snapshots & Replication Monitor',
    description: 'Inspect PostgreSQL replication lag, backup snapshots, and health heartbeats.',
  },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>(() =>
    MOCK_USERS ? Object.values(MOCK_USERS) : []
  );
  const [courses, setCourses] = useState<any[]>(() => MOCK_COURSES || []);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'STUDENT',
    status: 'ACTIVE',
    password: '',
    permissions: [] as string[],
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Role Modal
  const [roleModalUser, setRoleModalUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('STUDENT');
  const [roleReason, setRoleReason] = useState('');

  // Status Modal (Active / Suspended / Blocked)
  const [statusModalUser, setStatusModalUser] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'BLOCKED'>('ACTIVE');
  const [statusReason, setStatusReason] = useState('');

  // Manual Grant Modal
  const [grantModalUser, setGrantModalUser] = useState<any>(null);
  const [grantCourseId, setGrantCourseId] = useState('');
  const [grantAction, setGrantAction] = useState('GRANT');
  const [grantReason, setGrantReason] = useState('');

  // Maintenance Operation Permissions Modal
  const [permissionsModalUser, setPermissionsModalUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionsSaving, setPermissionsSaving] = useState(false);

  // User Activity Logs & Dossier Modal
  const [logsModalUser, setLogsModalUser] = useState<any>(null);
  const [logsData, setLogsData] = useState<{ user: any; logs: any[]; summary: any } | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');

  // Delete User Confirmation Modal
  const [deleteModalUser, setDeleteModalUser] = useState<any>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      if (users.length === 0) setIsLoading(true);
      const [uRes, cRes] = await Promise.all([
        api.get(`/admin/users?role=${roleFilter}&status=${statusFilter}&search=${encodeURIComponent(search)}`),
        api.get('/content/courses'),
      ]);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setCourses(Array.isArray(cRes.data) ? cRes.data : []);
      if (Array.isArray(cRes.data) && cRes.data.length > 0 && !grantCourseId) {
        setGrantCourseId(cRes.data[0].id);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search]);

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) {
      alert('Please enter user name and email address.');
      return;
    }
    setCreateSubmitting(true);
    try {
      await api.post('/admin/users', {
        name: createForm.name.trim(),
        email: createForm.email.trim().toLowerCase(),
        mobile: createForm.mobile.trim(),
        role: createForm.role,
        status: createForm.status,
        permissions: createForm.permissions,
        password: createForm.password || 'KenClasses@2026',
      });
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        mobile: '',
        role: 'STUDENT',
        status: 'ACTIVE',
        password: '',
        permissions: [],
      });
      fetchUsers();
      alert(`User ${createForm.name} created successfully.`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create user account.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteModalUser.id}`);
      setDeleteModalUser(null);
      setDeleteConfirmationText('');
      fetchUsers();
      alert(`User ${deleteModalUser.name} (${deleteModalUser.email}) removed permanently.`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Update Role
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    try {
      await api.patch(`/admin/users/${roleModalUser.id}/role`, {
        newRole,
        reason: roleReason || 'Administrative promotion / role update',
      });
      setRoleModalUser(null);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Role change failed.');
    }
  };

  // Handle Update Status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalUser) return;
    try {
      await api.patch(`/admin/users/${statusModalUser.id}/status`, {
        status: targetStatus,
        reason: statusReason || 'Administrative account status review',
      });
      setStatusModalUser(null);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Status change failed.');
    }
  };

  // Handle Save Maintenance Permissions
  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionsModalUser) return;
    setPermissionsSaving(true);
    try {
      await api.patch(`/admin/users/${permissionsModalUser.id}/permissions`, {
        permissions: selectedPermissions,
      });
      setPermissionsModalUser(null);
      fetchUsers();
      alert(`Operation permissions updated for ${permissionsModalUser.name}.`);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update permissions.');
    } finally {
      setPermissionsSaving(false);
    }
  };

  // Handle View Activity Logs
  const handleOpenLogs = async (user: any) => {
    setLogsModalUser(user);
    setLogsLoading(true);
    setLogFilter('ALL');
    try {
      const res = await api.get(`/admin/users/${user.id}/logs`);
      setLogsData(res.data);
    } catch (e) {
      console.error('Failed to load logs:', e);
      setLogsData(null);
    } finally {
      setLogsLoading(false);
    }
  };

  // Download User Logs Dossier as JSON
  const handleDownloadDossier = () => {
    if (!logsData || !logsModalUser) return;
    const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Dossier_${logsModalUser.email.replace(/[@.]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Manual Course Grant
  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModalUser || !grantCourseId) return;
    try {
      await api.post('/admin/enrolments/manual', {
        userId: grantModalUser.id,
        courseId: grantCourseId,
        action: grantAction,
        reason: grantReason || 'Administrative authorization',
      });
      setGrantModalUser(null);
      fetchUsers();
      alert(`Course access ${grantAction === 'GRANT' ? 'granted' : 'revoked'} successfully.`);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Manual grant failed.');
    }
  };

  // Filter users in memory as well for instant UX responsiveness
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(query);
      const matchEmail = u.email?.toLowerCase().includes(query);
      const matchMobile = u.mobile?.toLowerCase().includes(query);
      const matchRole = u.role?.toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchMobile && !matchRole) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
            Governance & User Administration
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5">
            User Accounts, RBAC Roles & Audit Dossier
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Create, block, or remove users; govern course entitlements; inspect separated activity logs; and configure maintenance operation access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUsers()}
            title="Refresh Data"
            className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl transition border border-zinc-200 dark:border-zinc-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCreateForm({
                name: '',
                email: '',
                mobile: '',
                role: 'STUDENT',
                status: 'ACTIVE',
                password: '',
                permissions: [],
              });
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs focus:bg-white dark:focus:bg-black focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="CONTENT_MANAGER">Content Manager</option>
            <option value="FINANCE_SUPPORT">Finance & Support</option>
            <option value="MODERATOR">Moderator</option>
            <option value="MAINTENANCE_TEAM">Maintenance Team</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 px-2">
            Showing {filteredUsers.length} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Operations / Permissions</th>
                <th className="p-4">Enrolments</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading platform user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const perms = Array.isArray(u.permissions) ? u.permissions : [];
                  return (
                    <tr key={u.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-zinc-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{u.email}</div>
                        {u.mobile && (
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                            {u.mobile}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : u.status === 'SUSPENDED'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4">
                        {perms.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                              {perms.length} {perms.length === 1 ? 'Operation' : 'Operations'}
                            </span>
                            <button
                              onClick={() => {
                                setPermissionsModalUser(u);
                                setSelectedPermissions(perms);
                              }}
                              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline ml-1"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setPermissionsModalUser(u);
                              setSelectedPermissions([]);
                            }}
                            className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 underline font-medium"
                          >
                            + Assign Ops
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-300 font-medium whitespace-nowrap">
                        {u._count?.enrolments || 0} courses
                      </td>
                      <td className="p-4 text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end flex-wrap gap-1">
                          {/* View Logs Dossier */}
                          <button
                            onClick={() => handleOpenLogs(u)}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold rounded-lg text-xs transition flex items-center space-x-1"
                            title="Inspect User Activity Logs"
                          >
                            <Activity className="w-3 h-3" />
                            <span>Logs</span>
                          </button>

                          {/* Grant Course Access */}
                          <button
                            onClick={() => {
                              setGrantModalUser(u);
                              setGrantReason('Administrative course entitlement');
                            }}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold rounded-lg text-xs transition flex items-center space-x-1"
                            title="Grant / Revoke Course Access"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Courses</span>
                          </button>

                          {/* Maintenance Operations Access */}
                          <button
                            onClick={() => {
                              setPermissionsModalUser(u);
                              setSelectedPermissions(u.permissions || []);
                            }}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold rounded-lg text-xs transition flex items-center space-x-1"
                            title="Maintenance Operations Access"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Ops</span>
                          </button>

                          {/* Change Role */}
                          <button
                            onClick={() => {
                              setRoleModalUser(u);
                              setNewRole(u.role);
                              setRoleReason('');
                            }}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold rounded-lg text-xs transition"
                            title="Change Role"
                          >
                            Role
                          </button>

                          {/* Block / Suspend / Reactivate */}
                          <button
                            onClick={() => {
                              setStatusModalUser(u);
                              setTargetStatus(u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                              setStatusReason(u.status === 'ACTIVE' ? 'Administrative security suspension.' : '');
                            }}
                            className={`px-2 py-1 font-bold rounded-lg text-xs transition ${
                              u.status === 'ACTIVE'
                                ? 'bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            }`}
                            title="Modify Account Standing"
                          >
                            {u.status === 'ACTIVE' ? 'Block/Suspend' : 'Reactivate'}
                          </button>

                          {/* Remove / Delete User */}
                          <button
                            onClick={() => {
                              setDeleteModalUser(u);
                              setDeleteConfirmationText('');
                            }}
                            className="p-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg transition"
                            title="Remove User Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Create New Platform User</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="name@kenclasses.com"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={createForm.mobile}
                    onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="MENTOR">Mentor / Lecturer</option>
                    <option value="CONTENT_MANAGER">Content Manager</option>
                    <option value="FINANCE_SUPPORT">Finance & Support</option>
                    <option value="MODERATOR">Community Moderator</option>
                    <option value="MAINTENANCE_TEAM">Maintenance Team</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Initial Account Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Initial Password (Optional)
                </label>
                <input
                  type="text"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Defaults to auto-generated temporary password"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              {/* Maintenance Operation Checkboxes if creating maintenance team or staff */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Initial Operation Access (Maintenance Team)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {MAINTENANCE_OPERATIONS.map((op) => {
                    const checked = createForm.permissions.includes(op.id);
                    return (
                      <label key={op.id} className="flex items-start space-x-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCreateForm({
                                ...createForm,
                                permissions: [...createForm.permissions, op.id],
                              });
                            } else {
                              setCreateForm({
                                ...createForm,
                                permissions: createForm.permissions.filter((p) => p !== op.id),
                              });
                            }
                          }}
                          className="mt-0.5 rounded border-zinc-300 text-black focus:ring-black"
                        />
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-white text-[11px]">{op.label}</div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{op.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition disabled:opacity-50"
                >
                  {createSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER ACTIVITY LOGS & DOSSIER MODAL */}
      {logsModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-black text-sm">
                  {logsModalUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
                    <span>User Activity Dossier & Audit Log</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                      ID: {logsModalUser.id}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {logsModalUser.name} • {logsModalUser.email} • Role: {logsModalUser.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadDossier}
                  disabled={!logsData}
                  className="px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50"
                  title="Export JSON Dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition border border-zinc-300 dark:border-zinc-700"
                  title="Print Audit Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLogsModalUser(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            {logsData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Total Events</div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white font-mono mt-0.5">
                    {logsData.logs?.length || 0}
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Auth Logins</div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white font-mono mt-0.5">
                    {logsData.summary?.totalLogins || 1}
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Account Status</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {logsData.summary?.accountHealth || 'Verified Active'}
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Security Alerts</div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white font-mono mt-0.5">
                    {logsData.summary?.securityViolations || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-400 font-semibold text-[11px]">Filter Type:</span>
              {['ALL', 'AUTH', 'LESSON', 'QUIZ', 'MAINTENANCE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLogFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    logFilter === type
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Chronological Logs Timeline */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {logsLoading ? (
                <div className="py-12 text-center text-zinc-400">
                  <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Compiling isolated audit logs for {logsModalUser.name}...
                </div>
              ) : !logsData || !logsData.logs || logsData.logs.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  No activity entries recorded for this user yet.
                </div>
              ) : (
                logsData.logs
                  .filter((l) => (logFilter === 'ALL' ? true : l.eventType?.includes(logFilter)))
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                            {log.eventType}
                          </span>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {log.status || 'OK'}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                        {log.details || log.action || 'Activity executed.'}
                      </div>

                      <div className="flex items-center space-x-3 text-[10px] text-zinc-400 font-mono pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Laptop className="w-3 h-3" />
                          <span className="truncate max-w-xs">{log.userAgent || 'Web Client'}</span>
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setLogsModalUser(null)}
                className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE OPERATIONS MODAL */}
      {permissionsModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
                  <Wrench className="w-4 h-4" />
                  <span>Maintenance Team Operational Access</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Target Member: <strong className="text-zinc-800 dark:text-zinc-200">{permissionsModalUser.name}</strong> ({permissionsModalUser.email})
                </p>
              </div>
              <button
                onClick={() => setPermissionsModalUser(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select granular operation privileges granted to this maintenance team member. Granted privileges allow executing emergency diagnostics, forum moderation, and live server restarts without full Super-Admin elevation.
            </p>

            <form onSubmit={handleSavePermissions} className="space-y-3">
              <div className="space-y-2 max-h-72 overflow-y-auto p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {MAINTENANCE_OPERATIONS.map((op) => {
                  const isChecked = selectedPermissions.includes(op.id);
                  return (
                    <label
                      key={op.id}
                      className={`flex items-start space-x-3 p-2.5 rounded-lg border cursor-pointer transition ${
                        isChecked
                          ? 'bg-white dark:bg-zinc-950 border-zinc-400 dark:border-zinc-600'
                          : 'bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, op.id]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter((id) => id !== op.id));
                          }
                        }}
                        className="mt-1 rounded border-zinc-300 text-black focus:ring-black"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs text-zinc-900 dark:text-white">{op.label}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{op.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPermissionsModalUser(null)}
                  className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={permissionsSaving}
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition disabled:opacity-50"
                >
                  {permissionsSaving ? 'Saving...' : 'Save Privileges'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / REMOVE USER MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-950/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Permanently Remove User?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You are about to remove <strong className="text-zinc-800 dark:text-zinc-200">{deleteModalUser.name}</strong> ({deleteModalUser.email}).
                All active enrolments, credentials, and user data will be purged.
              </p>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              Type <strong className="font-mono">{deleteModalUser.name}</strong> below to confirm deletion:
            </div>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder={deleteModalUser.name}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-medium"
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalUser(null);
                  setDeleteConfirmationText('');
                }}
                className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting || deleteConfirmationText !== deleteModalUser.name}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-40"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE CHANGE MODAL */}
      {roleModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Change User Privilege Role</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Target User: <strong className="text-zinc-800 dark:text-zinc-200">{roleModalUser.name}</strong> ({roleModalUser.email})
            </p>

            <form onSubmit={handleUpdateRole} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                >
                  <option value="STUDENT">Student</option>
                  <option value="MENTOR">Mentor / Lecturer</option>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="FINANCE_SUPPORT">Finance & Support Staff</option>
                  <option value="MODERATOR">Community Moderator</option>
                  <option value="MAINTENANCE_TEAM">Maintenance Team</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Reason for Change *</label>
                <input
                  type="text"
                  required
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  placeholder="e.g. Appointed faculty mentor for Web Dev"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
                >
                  Confirm Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACCOUNT STATUS MODAL (ACTIVE / SUSPENDED / BLOCKED) */}
      {statusModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Update Account Status: {statusModalUser.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              PRD ADM-03 Compliance: Blocking or suspending an account will immediately invalidate all active sessions and record an audit justification.
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target Account Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold"
                >
                  <option value="ACTIVE">Active (Restore Normal Access)</option>
                  <option value="SUSPENDED">Suspended (Temporary Account Freeze)</option>
                  <option value="BLOCKED">Blocked (Immediate Policy Invalidation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Documented Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Provide specific justification for compliance logs..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStatusModalUser(null)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-white text-xs font-bold rounded-lg transition ${
                    targetStatus === 'ACTIVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : targetStatus === 'SUSPENDED'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm Status Change ({targetStatus})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL COURSE GRANT / REVOKE MODAL */}
      {grantModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Authorize Course Entitlement</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              PRD ADM-09: Grant or revoke course entitlement for <strong className="text-zinc-800 dark:text-zinc-200">{grantModalUser.name}</strong>.
            </p>

            <form onSubmit={handleManualGrant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Action</label>
                <select
                  value={grantAction}
                  onChange={(e) => setGrantAction(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                >
                  <option value="GRANT">Grant Access (Activate Enrolment)</option>
                  <option value="REVOKE">Revoke Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target Course</label>
                <select
                  value={grantCourseId}
                  onChange={(e) => setGrantCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} (${c.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Mandatory Audit Justification *</label>
                <input
                  type="text"
                  required
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="e.g. Scholarship waiver approved"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setGrantModalUser(null)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold rounded-lg transition"
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
