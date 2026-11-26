'use client';

import { useState } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { filterResults, VERDICTS } from '../../../lib/stats';
import { removeResult } from '../../../lib/storage/results';
import { useStoredResults } from '../../../lib/storage/useStoredResults';
import type { Verdict } from '../../../types/api';
import { card, field, mutedText, secondaryButton, pageTitle } from '../../ui/styles';
import { DeleteAllButton } from './DeleteAllButton';
import { ResultSummary } from './ResultSummary';

export function HistoryView() {
  const { t } = useLanguage();
  const results = useStoredResults();
  const [query, setQuery] = useState('');
  const [verdict, setVerdict] = useState<Verdict | 'all'>('all');

  if (!results) return <p role="status">{t.result.loading}</p>;
  const visible = filterResults(results, query, verdict);

  return (
    <div className="flex flex-col gap-4">
      <h1 className={pageTitle}>{t.history.title}</h1>
      <p className={mutedText}>{t.history.limit}</p>

      {results.length === 0 ? (
        <p>{t.history.empty}</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
              {t.history.search}
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.history.filter}
              <select
                value={verdict}
                onChange={(event) => setVerdict(event.target.value as Verdict | 'all')}
                className={field}
              >
                <option value="all">{t.history.allVerdicts}</option>
                {VERDICTS.map((item) => (
                  <option key={item} value={item}>
                    {t.verdicts[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visible.length === 0 && <p role="status">{t.history.noMatch}</p>}
          <ul className="flex flex-col gap-2">
            {visible.map((result) => (
              <li key={result.id} className={`${card} flex items-start gap-3`}>
                <ResultSummary result={result} />
                <button
                  type="button"
                  className={secondaryButton}
                  aria-label={`${t.history.remove}: ${result.claim}`}
                  onClick={() => removeResult(result.id)}
                >
                  {t.history.remove}
                </button>
              </li>
            ))}
          </ul>
          <DeleteAllButton />
        </>
      )}
    </div>
  );
}
