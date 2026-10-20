import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n';
import api from '../api/client';
import { useAuth } from './AuthContext';

export type Theme = 'light' | 'dark';

interface ThemeLanguageContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Strict 2-theme requirement: 'light' | 'dark'
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Strict 2-language requirement: 'en' | 'hi'
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  // Synchronize DOM attributes with current state immediately
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Synchronize with server if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    api
      .get('/preferences')
      .then((res) => {
        if (!isMounted || !res.data) return;
        const serverTheme = res.data.theme === 'dark' ? 'dark' : 'light';
        const serverLang = res.data.language === 'hi' ? 'hi' : 'en';

        setThemeState(serverTheme);
        localStorage.setItem('theme', serverTheme);
        if (serverTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        setLanguageState(serverLang);
        localStorage.setItem('language', serverLang);
        document.documentElement.lang = serverLang;
      })
      .catch(() => {
        // Fall back to existing local preferences if API is offline or unauthenticated
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      const validTheme: Theme = newTheme === 'dark' ? 'dark' : 'light';
      setThemeState(validTheme);
      localStorage.setItem('theme', validTheme);

      if (validTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (isAuthenticated) {
        try {
          await api.put('/preferences', { theme: validTheme });
        } catch {
          // Keep local state on error
        }
      }
    },
    [isAuthenticated]
  );

  const setLanguage = useCallback(
    async (newLang: Language) => {
      const validLang: Language = newLang === 'hi' ? 'hi' : 'en';
      setLanguageState(validLang);
      localStorage.setItem('language', validLang);
      document.documentElement.lang = validLang;

      if (isAuthenticated) {
        try {
          await api.put('/preferences', { language: validLang });
        } catch {
          // Keep local state on error
        }
      }
    },
    [isAuthenticated]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const currentDict = translations[language] || translations.en;
      return currentDict[key] ?? fallback ?? (translations.en[key] as string) ?? key;
    },
    [language]
  );

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        language,
        setTheme,
        setLanguage,
        toggleTheme,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
