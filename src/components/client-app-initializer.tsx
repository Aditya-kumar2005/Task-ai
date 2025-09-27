
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Toaster } from "@/components/ui/toaster";
import { FcmHandler } from '@/components/fcm-handler'; // Import FcmHandler

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

  return (
    <>
      {children}
      <Toaster />
      <FcmHandler /> {/* Add FcmHandler here */}
    </>
  );
}
