import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface UserProfile {
  college?: string;
  academicYear?: string;
  academicCourse?: string;
  bio?: string;
  notificationPrefs?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'MENTOR' | 'CONTENT_MANAGER' | 'FINANCE_SUPPORT' | 'MODERATOR' | 'SUPER_ADMIN';
  mobile?: string;
  username?: string;
  isEmailVerified: boolean;
  profile?: UserProfile;
  enrolmentsCount?: number;
  unreadNotificationsCount?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  verifyOtp: (identifier: string, code: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoUser: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If not logged in, or user already cached in localStorage, start with 0ms loading state
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    return Boolean(t && !u);
  });

  const refreshUser = async () => {
    try {
      if (!localStorage.getItem('token')) {
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.post('/auth/login', { identifier, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const verifyOtp = async (identifier: string, code: string) => {
    const res = await api.post('/auth/verify-otp', { identifier, code });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Demo convenience helper to rapidly log in as any role
  const switchDemoUser = async (email: string) => {
    setIsLoading(true);
    try {
      await login(email, 'Password123!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        refreshUser,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
