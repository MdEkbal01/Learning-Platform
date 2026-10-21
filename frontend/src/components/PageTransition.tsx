import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Instant zero-lag scroll reset on route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="w-full flex-1 page-fade-enter">
      {children}
    </div>
  );
};
