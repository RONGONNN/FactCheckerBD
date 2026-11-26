'use client';

import Link from 'next/link';
import { homeContent } from '../../lib/i18n/home';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { Logo } from '../ui/Logo';
import { focusRing, mutedText } from '../ui/styles';

export function Footer() {
  const { t, language } = useLanguage();
  const content = homeContent[language];
  const columns = [
    {
      title: content.footerExplore,
      links: [
        { href: '/', label: t.nav.dashboard },
        { href: '/history', label: t.nav.history },
        { href: '/sources', label: t.nav.sources },
        { href: '/contact', label: t.nav.feedback },
      ],
    },
    {
      title: content.footerProject,
      links: [
        { href: '/how-it-works', label: t.nav.howItWorks },
        { href: '/about', label: t.nav.about },
        { href: '/privacy', label: t.nav.privacy },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-100 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col items-start gap-2">
          <Logo />
          <p className={mutedText}>{content.footerAbout}</p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-2 text-sm font-bold tracking-wide text-navy uppercase">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${mutedText} hover:text-navy ${focusRing}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
