import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Building, BookOpen, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.profile?.college || '');
  const [academicYear, setAcademicYear] = useState(user?.profile?.academicYear || '1st Year');
  const [academicCourse, setAcademicCourse] = useState(user?.profile?.academicCourse || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCollege(user.profile?.college || '');
      setAcademicYear(user.profile?.academicYear || '1st Year');
      setAcademicCourse(user.profile?.academicCourse || '');
      setBio(user.profile?.bio || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await api.put('/auth/profile', {
        name,
        college,
        academicYear,
        academicCourse,
        bio,
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Account & Academic Profile</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your personal credentials, contact verification, and institutional affiliations.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Verification & Role Status Pill */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-zinc-900 text-sm">{user?.name}</div>
              <div className="text-zinc-500">{user?.email}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
              Email Verified ✓
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2.5 py-1 rounded-full text-[11px] font-bold">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Primary Email (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-lg text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="pt-2 border-t border-zinc-100 space-y-4">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
              Academic Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">Academic Level</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Faculty">Faculty / Staff</option>
                  <option value="Professional">Professional Practitioner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">Degree / Specialization</label>
                <input
                  type="text"
                  value={academicCourse}
                  onChange={(e) => setAcademicCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">Bio / Academic Interests</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-xs transition"
            >
              {isLoading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
