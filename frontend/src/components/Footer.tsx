import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, CheckCircle2, LifeBuoy, Settings, MessageSquare } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-white text-lg font-bold">AuraLMS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-performance, secure online course commerce & learning delivery system.
              Compliant with least-privilege RBAC, cryptographic payment verification, and verified completion credentials.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>TLS 1.3 & Server-side RBAC Verified</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Learning Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-white transition">Course Catalogue</Link></li>
              <li><Link to="/verify-certificate" className="hover:text-white transition">Certificate Registry</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-white transition">Student Portal</Link></li>
              <li><Link to="/student/live-classes" className="hover:text-white transition">Live Masterclasses</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Help & Preferences</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-white transition flex items-center space-x-1.5">
                  <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('helpAndSupport')}</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition flex items-center space-x-1.5">
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('accountSettings')}</span>
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('feedback')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Operational Support</h4>
            <p className="text-xs text-slate-400 mb-3">
              Technical issues or billing reconciliation questions?
            </p>
            <div className="bg-slate-800/80 dark:bg-slate-900 p-3 rounded-lg border border-slate-700 dark:border-slate-800 text-xs">
              <div className="font-medium text-white">System Status: Operational</div>
              <div className="text-[11px] text-slate-400 mt-1">99.5% Monthly Target SLA</div>
              <div className="text-[11px] text-slate-400">support@lms.local</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>© 2026 AuraLMS. All rights reserved. Meets LMS PRD Specification v1.0.</div>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
