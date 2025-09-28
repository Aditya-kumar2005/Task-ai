
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface ClientAppInitializerProps {
  children: ReactNode;
}

export function ClientAppInitializer({ children }: ClientAppInitializerProps) {
  const { locale } = useLanguage();

  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return <>{children}</>;
}
