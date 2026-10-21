import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle2,
  Save,
  ShieldAlert,
} from 'lucide-react';

export const MaintenanceSettings: React.FC = () => {
  const [flags, setFlags] = useState<any[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      const res = await api.get('/admin/maintenance');
      const list = Array.isArray(res.data) ? res.data : [];
      setFlags(list);
      const msgMap: any = {};
      list.forEach((f: any) => {
        msgMap[f.featureKey] = f.message;
      });
      setMessages(msgMap);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = async (featureKey: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await api.post('/admin/maintenance', {
        featureKey,
        isEnabled: newStatus,
        message: messages[featureKey] || 'This service is currently undergoing scheduled maintenance.',
      });
      setSuccessMsg(`Maintenance flag for ${featureKey} updated to ${newStatus ? 'ACTIVE' : 'OFF'}.`);
      fetchFlags();
    } catch (e: any) {
      alert('Failed to update maintenance setting.');
    }
  };

  const handleSaveMessage = async (featureKey: string, isEnabled: boolean) => {
    try {
      await api.post('/admin/maintenance', {
        featureKey,
        isEnabled,
        message: messages[featureKey],
      });
      setSuccessMsg(`Notice message for ${featureKey} saved.`);
      fetchFlags();
    } catch (e) {
      alert('Failed to save message.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <div className="text-xs uppercase font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">System Operations</div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5">Feature-Level Maintenance Switches</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          PRD ADM-04: Gracefully disable specific modules (checkout, forum, live streams) with custom user notices without taking down the entire LMS.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flags.map((flag) => {
          const isEnabled = flag.isEnabled;
          return (
            <div
              key={flag.id}
              className={`bg-white dark:bg-zinc-950 rounded-2xl border p-6 shadow-xs space-y-4 transition ${
                isEnabled ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Feature Switch
                  </span>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                    {flag.featureKey.replace(/_/g, ' ')}
                  </h3>
                </div>

                <button
                  onClick={() => handleToggle(flag.featureKey, isEnabled)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                    isEnabled
                      ? 'bg-amber-500 text-amber-950 hover:bg-amber-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{isEnabled ? 'MAINTENANCE ON' : 'OPERATIONAL'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  User-Facing Notice Banner Message
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messages[flag.featureKey] || ''}
                    onChange={(e) =>
                      setMessages((prev) => ({ ...prev, [flag.featureKey]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg text-xs"
                  />
                  <button
                    onClick={() => handleSaveMessage(flag.featureKey, isEnabled)}
                    className="px-3 py-1.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Last updated: {new Date(flag.updatedAt).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
