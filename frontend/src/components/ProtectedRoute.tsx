import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Validating secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN' && (user.role as string) !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-zinc-950 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-xs text-center">
        <div className="w-12 h-12 mx-auto bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center font-bold text-xl mb-4">
          !
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Access Restricted</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Your account role (<span className="font-semibold text-zinc-900 dark:text-zinc-200">{user.role}</span>) does not have permission to access this area.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
