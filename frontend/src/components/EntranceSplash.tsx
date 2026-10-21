import React, { useEffect, useState } from 'react';

export const EntranceSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if splash has already been seen (persistent in localStorage to ensure zero delay on return)
    const hasSeen = localStorage.getItem('ken_classes_splash_seen') || sessionStorage.getItem('ken_classes_splash_seen');
    if (!hasSeen) {
      setVisible(true);
      localStorage.setItem('ken_classes_splash_seen', 'true');
      sessionStorage.setItem('ken_classes_splash_seen', 'true');

      // Snappy micro-entrance that clears almost instantly (180ms)
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 180);

      // Fully unmount after 280ms total
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 280);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xs transition-opacity duration-200 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome to Ken Classes"
    >
      <div className="relative z-10 flex flex-col items-center space-y-4 px-4 text-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-2xl overflow-hidden">
          <img
            src="/logo.png"
            alt="Ken Classes Official Emblem"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase">
            Ken Classes
          </h1>
          <p className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase mt-0.5">
            Learning Without Limits
          </p>
        </div>
      </div>
    </div>
  );
};
