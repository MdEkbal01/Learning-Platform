import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LifeBuoy, Settings, MessageSquare } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 text-sm mt-auto border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-zinc-900 dark:text-white text-lg font-bold">AuraLMS</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              High-performance, secure online course commerce & learning delivery system.
              Compliant with least-privilege RBAC, cryptographic payment verification, and verified completion credentials.
            </p>
            <div className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>TLS 1.3 & Server-side RBAC Verified</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">Learning Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-black dark:hover:text-white transition">Course Catalogue</Link></li>
              <li><Link to="/verify-certificate" className="hover:text-black dark:hover:text-white transition">Certificate Registry</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-black dark:hover:text-white transition">Student Portal</Link></li>
              <li><Link to="/student/live-classes" className="hover:text-black dark:hover:text-white transition">Live Masterclasses</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">Help & Preferences</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-black dark:hover:text-white transition flex items-center space-x-1.5">
                  <LifeBuoy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('helpAndSupport')}</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-black dark:hover:text-white transition flex items-center space-x-1.5">
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('accountSettings')}</span>
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-black dark:hover:text-white transition flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('doubts')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">System Architecture</h4>
            <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>All systems operational</span>
              </div>
              <div>Single Page Architecture • Node 20+</div>
              <div>SQLite & Prisma ORM • JWT Auth</div>
              <div className="pt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                © {new Date().getFullYear()} AuraLMS Inc. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
