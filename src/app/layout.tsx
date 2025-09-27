
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider
import { translations, defaultLocale } from '@/lib/translations';
import { ClientAppInitializer } from '@/components/client-app-initializer';

const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

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
    <html lang={defaultLocale} className={interFont.variable}>
      <body className="font-body antialiased">
        <AuthProvider> {/* Wrap with AuthProvider */}
          <LanguageProvider>
            <ClientAppInitializer>{children}</ClientAppInitializer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
