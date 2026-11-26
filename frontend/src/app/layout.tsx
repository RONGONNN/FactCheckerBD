import type { Metadata } from 'next';
import { Hind_Siliguri, Plus_Jakarta_Sans } from 'next/font/google';
import { AppShell } from '../components/layout/AppShell';
import { LanguageProvider } from '../lib/i18n/LanguageProvider';
import './globals.css';

const latin = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-latin' });
const bangla = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla',
});

export const metadata: Metadata = {
  title: 'FactCheck',
  description: 'AI-assisted preliminary fact-checking in Bangla and English.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="bn" className={`${latin.variable} ${bangla.variable} antialiased`}>
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
