import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LifeBuoy, Settings, MessageSquare, MapPin, Phone, Mail } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 text-sm mt-auto border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="Ken Classes Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-zinc-900 dark:text-white text-lg font-bold block leading-none">Ken Classes</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Learning Without Limits</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              High-performance, ISO & UGC-DEB recognized online education platform. Delivering masterclasses,
              cryptographic certificates, and verified curriculum across engineering, science, and leadership.
            </p>
            <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>TLS 1.3 & Server-side RBAC Verified</span>
            </div>
          </div>

          {/* Col 2: Learning Modules */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Learning Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-black dark:hover:text-white transition">Course Catalogue</Link></li>
              <li><Link to="/verify-certificate" className="hover:text-black dark:hover:text-white transition">Certificate Registry</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-black dark:hover:text-white transition">Student Portal</Link></li>
              <li><Link to="/student/live-classes" className="hover:text-black dark:hover:text-white transition">Live Masterclasses</Link></li>
              <li>
                <Link to="/help" className="hover:text-black dark:hover:text-white transition flex items-center space-x-1.5 pt-1">
                  <LifeBuoy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('helpAndSupport')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Campus Info */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Campus & Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                <span>Ken Classes EduTower, Sector 62, Knowledge Corridor, Noida & Bengaluru, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-black dark:hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <a href="mailto:kenclasses95@gmail.com" className="hover:text-black dark:hover:text-white transition">
                  kenclasses95@gmail.com
                </a>
              </li>
              <li className="pt-1">
                <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  Admissions Open 2026-2027
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Presence & Security */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Connect & Community
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Follow Ken Classes for lecture notes, webinar announcements, and student milestones:
            </p>
            <div className="flex items-center space-x-2 mb-4">
              {/* Facebook */}
              <a
                href="https://facebook.com/kenclasses"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ken Classes on Facebook"
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/kenclasses"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ken Classes on X (Twitter)"
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/kenclasses"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ken Classes on Instagram"
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/kenclasses"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ken Classes on LinkedIn"
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@kenclasses"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ken Classes on YouTube"
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Production Nodes 100% Operational</span>
              </div>
              <div>Single Page Architecture • Node 20+</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            © {new Date().getFullYear()} Ken Classes. All rights reserved. Registered Educational Institution.
          </div>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <Link to="/help" className="hover:text-black dark:hover:text-white transition">Privacy Policy</Link>
            <Link to="/help" className="hover:text-black dark:hover:text-white transition">Terms of Service</Link>
            <Link to="/verify-certificate" className="hover:text-black dark:hover:text-white transition">Credential Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
