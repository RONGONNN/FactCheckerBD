'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { Evidence, Source } from '../../../types/api';
import { card, focusRing, mutedText } from '../../ui/styles';

interface EvidenceListProps {
  title: string;
  items: Evidence[];
  sources: Source[];
}

export function EvidenceList({ title, items, sources }: EvidenceListProps) {
  const { t } = useLanguage();

  return (
    <section className={card}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className={mutedText}>{t.result.noEvidence}</p>
      ) : (
        <ul className="list-disc space-y-2 pl-5">
          {items.map((item) => (
            <li key={`${item.text}-${item.sourceIds.join()}`}>
              {item.text}{' '}
              {sources
                .filter((source) => item.sourceIds.includes(source.id))
                .map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={source.title}
                    aria-label={`${t.result.source} ${source.id}: ${source.publisher}`}
                    className={`mr-1 inline-block rounded bg-blue-100 px-1.5 text-sm font-semibold text-blue-800 underline ${focusRing}`}
                  >
                    [{source.id}] {source.publisher}
                  </a>
                ))}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
