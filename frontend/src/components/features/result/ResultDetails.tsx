'use client';

import Link from 'next/link';
import { formatDateTime } from '../../../lib/format';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { CheckResult } from '../../../types/api';
import { card, mutedText, primaryButton } from '../../ui/styles';
import { EvidenceList } from './EvidenceList';
import { SourceList } from './SourceList';
import { VerdictBadge } from './VerdictBadge';

export function ResultDetails({ result }: { result: CheckResult }) {
  const { t, language } = useLanguage();
  const checkedAt = formatDateTime(result.checkedAt, language);

  return (
    <article className="flex flex-col gap-4">
      <h1>
        <VerdictBadge verdict={result.verdict} />
      </h1>
      <section className={card}>
        <h2 className={mutedText}>{t.result.claim}</h2>
        <p className="font-medium break-words">{result.claim}</p>
      </section>
      <section className={card}>
        <h2 className="mb-1 font-semibold">{t.result.explanation}</h2>
        <p>{result.explanation}</p>
      </section>
      <EvidenceList
        title={t.result.supporting}
        items={result.supporting}
        sources={result.sources}
      />
      <EvidenceList
        title={t.result.contradicting}
        items={result.contradicting}
        sources={result.sources}
      />
      <SourceList sources={result.sources} />
      <p className="rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
        {t.result.warning}
      </p>
      {checkedAt && (
        <p className={mutedText}>
          {t.result.checkedAt}: {checkedAt}
        </p>
      )}
      <Link href="/" className={`self-start ${primaryButton}`}>
        {t.result.another}
      </Link>
    </article>
  );
}
