import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { AlertTriangle, X } from 'lucide-react';

interface Flag {
  featureKey: string;
  isEnabled: boolean;
  message: string;
}

export const MaintenanceBanner: React.FC = () => {
  const [activeFlags, setActiveFlags] = useState<Flag[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const res = await api.get('/maintenance/status');
        const active = (res.data || []).filter((f: Flag) => f.isEnabled);
        setActiveFlags(active);
      } catch {
        // ignore
      }
    };
    fetchFlags();
    const interval = setInterval(fetchFlags, 30000); // 30 sec polling
    return () => clearInterval(interval);
  }, []);

  if (dismissed || activeFlags.length === 0) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0 animate-pulse" />
          <span>
            <strong>Scheduled Notice:</strong>{' '}
            {activeFlags.map((f) => `[${f.featureKey.replace(/_/g, ' ')}]: ${f.message}`).join(' • ')}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-900 hover:text-black p-1 transition"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
