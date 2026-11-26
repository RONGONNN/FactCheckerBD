'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { infoPages, type InfoPageKey } from '../../../lib/i18n/pages';
import { card, pageTitle } from '../../ui/styles';

export function InfoPage({ page }: { page: InfoPageKey }) {
  const { language } = useLanguage();
  const { title, sections } = infoPages[language][page];

  return (
    <article className="flex flex-col gap-4">
      <h1 className={pageTitle}>{title}</h1>
      {sections.map((section) => (
        <section key={section.heading} className={card}>
          <h2 className="mb-1 font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-1 break-words">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
