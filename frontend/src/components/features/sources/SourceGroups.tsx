'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { ApprovedSource } from '../../../types/api';
import { card, focusRing, sectionTitle } from '../../ui/styles';

const TYPES: ApprovedSource['type'][] = ['factcheck', 'news'];

export function SourceGroups({ sources }: { sources: ApprovedSource[] }) {
  const { t } = useLanguage();

  return TYPES.map((type) => {
    const items = sources.filter((source) => source.type === type);
    if (items.length === 0) return null;
    return (
      <section key={type} className="flex flex-col gap-2">
        <h2 className={sectionTitle}>{t.sourceTypes[type]}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((source) => (
            <li key={source.name} className={card}>
              <p className="font-semibold">{source.name}</p>
              <a
                href={`https://${source.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm break-words text-blue-700 underline ${focusRing}`}
              >
                {source.domain}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  });
}
