'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import type { Messages } from '../../lib/i18n/messages';
import { focusRing } from '../ui/styles';

const LINKS: { href: string; label: keyof Messages['nav'] }[] = [
  { href: '/', label: 'dashboard' },
  { href: '/history', label: 'history' },
  { href: '/sources', label: 'sources' },
  { href: '/how-it-works', label: 'howItWorks' },
  { href: '/about', label: 'about' },
  { href: '/privacy', label: 'privacy' },
  { href: '/contact', label: 'feedback' },
];

export function MainNav({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={pathname === href ? 'page' : undefined}
          className={`block rounded-lg px-3 py-2 hover:bg-slate-100 aria-[current=page]:bg-blue-100 aria-[current=page]:font-semibold dark:hover:bg-slate-800 dark:aria-[current=page]:bg-blue-950 ${focusRing}`}
        >
          {t.nav[label]}
        </Link>
      ))}
    </nav>
  );
}
