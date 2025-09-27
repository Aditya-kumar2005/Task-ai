
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Locale, Translations } from '@/types';
import { translations, defaultLocale } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Note: For persistence, you'd typically load from localStorage here
    // and save on locale change. For this example, it resets on refresh.
  }, []);

  const t = (key: keyof Translations): string => {
    if (!isMounted) {
      // Return default language string during server render or before hydration
      return translations[defaultLocale][key];
    }
    return translations[locale][key] || translations[defaultLocale][key];
  };

  if (!isMounted) {
    // Render a loader or null until mounted to avoid hydration mismatch for initial text
    // Or, more practically for this case, render with defaultLocale text which is what t() will produce
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
