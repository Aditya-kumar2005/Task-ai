import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import { translations, defaultLocale } from '@/lib/translations';
import { ClientAppInitializer } from '@/components/client-app-initializer';
import { ToasterProvider } from '@/hooks/use-toast.tsx';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: translations[defaultLocale].appTitle,
    description: translations[defaultLocale].siteDescription,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} className={inter.variable}>
      <body className="font-body antialiased">
        <AuthProvider>
          <LanguageProvider>
            <ToasterProvider>
              <ClientAppInitializer>{children}</ClientAppInitializer>
              <Toaster />
            </ToasterProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
