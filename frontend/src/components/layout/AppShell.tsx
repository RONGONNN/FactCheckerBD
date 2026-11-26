'use client';

import { Suspense, useState, type ReactNode } from 'react';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { Logo } from '../ui/Logo';
import { secondaryButton } from '../ui/styles';
import { Footer } from './Footer';
import { MainNav } from './MainNav';

export function AppShell({ children }: { children: ReactNode }) {
  const { t, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Logo />
          <div className="ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
            <button type="button" className={secondaryButton} onClick={toggleLanguage}>
              {t.switchLanguage}
            </button>
            <button
              type="button"
              className={`lg:hidden ${secondaryButton}`}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {t.nav.menu}
            </button>
          </div>
          <div
            id="main-menu"
            className={`${menuOpen ? 'block' : 'hidden'} w-full lg:order-2 lg:ml-auto lg:block lg:w-auto`}
          >
            <Suspense fallback={null}>
              <MainNav onNavigate={() => setMenuOpen(false)} />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
