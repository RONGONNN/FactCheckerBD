'use client';

import Link from 'next/link';
import { homeContent } from '../../../lib/i18n/home';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { ClaimForm } from '../claim/ClaimForm';
import { primaryButton, secondaryButton } from '../../ui/styles';

export function Hero() {
  const { language } = useLanguage();
  const content = homeContent[language];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 lg:grid-cols-2 lg:py-16">
        <div className="flex flex-col items-start gap-5">
          <p className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-navy shadow-sm">
            {content.badge}
          </p>
          <h1 className="text-4xl leading-tight font-extrabold text-navy md:text-5xl">
            {content.titleTop}
            <span className="block text-accent">{content.titleAccent}</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600">{content.lead}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#claim" className={primaryButton}>
              {content.start}
            </a>
            <Link href="/how-it-works" className={`${secondaryButton} px-6 py-2.5 text-base`}>
              {content.learnMore}
            </Link>
          </div>
        </div>
        <ClaimForm />
      </div>
    </section>
  );
}
