'use client';

import Link from 'next/link';
import { Suspense, useState, type ReactNode } from 'react';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { focusRing, mutedText, secondaryButton } from '../ui/styles';
import { MainNav } from './MainNav';

export function AppShell({ children }: { children: ReactNode }) {
  const { t, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="border-b border-slate-200 bg-white md:w-60 md:shrink-0 md:border-r md:border-b-0 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3 p-4 md:flex-col md:items-start">
          <div>
            <Link href="/" className={`text-xl font-bold ${focusRing}`}>
              FactCheck
            </Link>
            <p className={mutedText}>{t.tagline}</p>
          </div>
          <button
            type="button"
            className={`md:hidden ${secondaryButton}`}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {t.nav.menu}
          </button>
        </div>
        <div
          id="main-menu"
          className={`${menuOpen ? 'flex' : 'hidden'} flex-col gap-3 px-4 pb-4 md:flex`}
        >
          <Suspense fallback={null}>
            <MainNav onNavigate={() => setMenuOpen(false)} />
          </Suspense>
          <button type="button" className={secondaryButton} onClick={toggleLanguage}>
            {t.switchLanguage}
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
