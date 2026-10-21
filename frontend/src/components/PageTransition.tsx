import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsNavigating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      {/* Top slim navigation progress bar */}
      <div
        className={`fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none transition-all duration-300 ${
          isNavigating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-route-progress" />
      </div>

      {/* Animated Route Content Wrapper */}
      <div
        key={location.pathname}
        className="w-full flex-1 page-fade-enter"
      >
        {children}
      </div>
    </>
  );
};
