'use client';

import { homeContent } from '../../../lib/i18n/home';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { primaryButton } from '../../ui/styles';

export function Banner() {
  const { language } = useLanguage();
  const content = homeContent[language];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-r from-navy via-[#143a85] to-[#7a3b2e] p-8 text-white md:p-12">
        <h2 className="max-w-xl text-2xl font-extrabold md:text-4xl">{content.bannerTitle}</h2>
        <p className="text-blue-100">{content.bannerText}</p>
        <a href="#claim" className={primaryButton}>
          {content.start}
        </a>
      </div>
    </section>
  );
}
