import React, { useEffect, useState } from 'react';

interface VerificationSpinnerProps {
  title?: string;
  subtitle?: string;
  targetPercent?: number;
  durationMs?: number;
  onComplete?: () => void;
  showResend?: boolean;
  onResend?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationSpinner: React.FC<VerificationSpinnerProps> = ({
  title = 'Verifying...',
  subtitle = 'Securely checking your credentials.',
  targetPercent = 100,
  durationMs = 1500,
  onComplete,
  showResend = false,
  onResend,
  size = 'md',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const fraction = Math.min(elapsed / durationMs, 1);
      // Smooth ease-out quad curve
      const eased = 1 - (1 - fraction) * (1 - fraction);
      const current = Math.round(eased * targetPercent);
      setProgress(current);

      if (fraction < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetPercent, durationMs, onComplete]);

  // Dimension mapping
  const radius = size === 'sm' ? 36 : size === 'lg' ? 56 : 46;
  const strokeWidth = size === 'sm' ? 5 : size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const dimension = radius * 2 + strokeWidth * 2 + 16;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-5 animate-in fade-in duration-300">
      {/* Header text */}
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
            {subtitle}
          </p>
        )}
      </div>

      {/* Circular Animated SVG Progress Gauge */}
      <div className="relative flex items-center justify-center my-2">
        {/* Soft background glow (Monochrome) */}
        <div className="absolute inset-0 rounded-full bg-zinc-400/10 dark:bg-zinc-600/10 blur-xl scale-75 animate-pulse" />

        <svg width={dimension} height={dimension} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-200 dark:text-zinc-800"
            fill="transparent"
          />
          {/* Active Gradient Indicator */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="url(#verifyGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
            fill="transparent"
          />
          <defs>
            <linearGradient id="verifyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#71717a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Counter Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono">
            {progress}
          </span>
        </div>
      </div>

      {/* Resend Link if requested */}
      {showResend && (
        <div className="pt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Didn't receive it?{' '}
          <button
            type="button"
            onClick={onResend}
            className="text-zinc-900 dark:text-zinc-100 font-semibold hover:underline cursor-pointer"
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
};
