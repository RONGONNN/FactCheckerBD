'use client';

import Link from 'next/link';
import { formatNumber } from '../../../lib/format';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { countByVerdict } from '../../../lib/stats';
import { useStoredResults } from '../../../lib/storage/useStoredResults';
import { card, focusRing, mutedText } from '../../ui/styles';
import { ResultSummary } from '../history/ResultSummary';
import { VerdictChart } from './VerdictChart';

const RECENT_COUNT = 5;

export function DashboardStats() {
  const { t, language } = useLanguage();
  const results = useStoredResults();
  if (!results) return null;

  return (
    <section aria-labelledby="stats-title" className="mt-8 flex flex-col gap-4">
      <h2 id="stats-title" className="text-xl font-bold">
        {t.stats.heading}
      </h2>
      {results.length === 0 ? (
        <p className={mutedText}>{t.stats.empty}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <div className={card}>
              <p className={mutedText}>{t.stats.total}</p>
              <p className="text-4xl font-bold">{formatNumber(results.length, language)}</p>
            </div>
            <div className={card}>
              <h3 className="mb-3 font-semibold">{t.stats.byVerdict}</h3>
              <VerdictChart counts={countByVerdict(results)} />
            </div>
          </div>
          <div className={card}>
            <h3 className="mb-3 font-semibold">{t.stats.recent}</h3>
            <ul className="flex flex-col gap-3">
              {results.slice(0, RECENT_COUNT).map((result) => (
                <li key={result.id} className="flex">
                  <ResultSummary result={result} />
                </li>
              ))}
            </ul>
            <Link
              href="/history"
              className={`mt-3 inline-block text-sm text-blue-700 underline dark:text-blue-300 ${focusRing}`}
            >
              {t.stats.allHistory}
            </Link>
          </div>
        </>
      )}
      <p className={mutedText}>{t.stats.localOnly}</p>
    </section>
  );
}
