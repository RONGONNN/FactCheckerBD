'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { Source } from '../../../types/api';
import { card, focusRing, mutedText } from '../../ui/styles';

function SourceCard({ source }: { source: Source }) {
  const { t } = useLanguage();
  return (
    <li className={card}>
      <p className={mutedText}>
        [{source.id}] {source.publisher} · {t.sourceTypes[source.type]}
        {source.publishedAt && ` · ${source.publishedAt}`}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-medium break-words text-blue-700 underline ${focusRing}`}
      >
        {source.title}
      </a>
    </li>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  const { t } = useLanguage();
  if (sources.length === 0) return <p className={mutedText}>{t.result.noSources}</p>;

  // Fact-checks are kept apart from ordinary news reports.
  const groups = [
    { title: t.result.factcheckSources, items: sources.filter((s) => s.type === 'factcheck') },
    { title: t.result.newsSources, items: sources.filter((s) => s.type === 'news') },
  ];

  return groups
    .filter((group) => group.items.length > 0)
    .map((group) => (
      <section key={group.title} className="flex flex-col gap-2">
        <h2 className="font-semibold">{group.title}</h2>
        <ul className="flex flex-col gap-2">
          {group.items.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </ul>
      </section>
    ));
}
