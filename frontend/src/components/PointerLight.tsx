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
      {/* Ambient Mouse-following Radial Light (CodeByGaurav signature pointer-light) */}
      <div
        className={`absolute rounded-full blur-3xl transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${opacityClass} bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500`}
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
