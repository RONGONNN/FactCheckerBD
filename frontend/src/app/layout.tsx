import type { Metadata } from 'next';
import { AppShell } from '../components/layout/AppShell';
import { LanguageProvider } from '../lib/i18n/LanguageProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'FactCheck',
  description: 'AI-assisted preliminary fact-checking in Bangla and English.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="bn" className="antialiased">
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
