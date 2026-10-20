import React, { useEffect, useState } from 'react';

interface PointerLightProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
}

export const PointerLight: React.FC<PointerLightProps> = ({ className = '', intensity = 'subtle' }) => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  const opacityClass = intensity === 'vibrant' ? 'opacity-40 dark:opacity-25' : 'opacity-25 dark:opacity-15';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {/* Ambient Mouse-following Radial Light (Monochrome White/Black) */}
      <div
        className={`absolute rounded-full blur-3xl transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${opacityClass} bg-gradient-to-tr from-zinc-300 via-zinc-200 to-zinc-400 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '450px',
          height: '450px',
        }}
      />
    </div>
  );
};
