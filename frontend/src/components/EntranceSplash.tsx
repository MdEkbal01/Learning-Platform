import React, { useEffect, useState } from 'react';

export const EntranceSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this browser session
    const hasSeen = sessionStorage.getItem('ken_classes_splash_seen');
    if (!hasSeen) {
      setVisible(true);
      sessionStorage.setItem('ken_classes_splash_seen', 'true');

      // Begin snappy fade-out sequence after 450ms
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 450);

      // Fully unmount after fade transition completes (700ms total)
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 150);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-500 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome to Ken Classes - Click to enter"
    >
      {/* Ambient background glow ring */}
      <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-400/20 to-transparent blur-3xl animate-pulse pointer-events-none" />

      {/* Main Branding Container */}
      <div className="relative z-10 flex flex-col items-center space-y-6 px-4 text-center">
        {/* Animated Emblem Frame */}
        <div className="relative group">
          {/* Pulsing halo */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/60 to-amber-500/40 blur-md animate-spin-slow opacity-80" />

          {/* Logo circular badge */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-amber-300 to-amber-600 shadow-2xl overflow-hidden transform transition hover:scale-105 duration-300">
            <img
              src="/logo.png"
              alt="Ken Classes Official Emblem"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Text Sequence with Staggered Fade */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white uppercase drop-shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            Ken Classes
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-amber-300 uppercase animate-in fade-in slide-in-from-bottom-3 duration-1000 delay-150">
            Learning Without Limits
          </p>
        </div>

        {/* Golden accent bar divider */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-in zoom-in duration-700 delay-300" />

        {/* Progress indicator line */}
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mt-4 relative">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 w-full animate-splash-progress rounded-full" />
        </div>

        <span className="text-[10px] tracking-widest uppercase text-zinc-500 pt-2 animate-pulse">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};
