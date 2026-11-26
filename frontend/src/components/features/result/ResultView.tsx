'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { useStoredResults } from '../../../lib/storage/useStoredResults';
import { mutedText, primaryButton } from '../../ui/styles';
import { FeedbackForm } from '../feedback/FeedbackForm';
import { ResultDetails } from './ResultDetails';

export function ResultView() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const results = useStoredResults();

  if (!results) return <p role="status">{t.result.loading}</p>;

  const result = results.find((item) => item.id === id);
  if (result) {
    return (
      <>
        <ResultDetails result={result} />
        {/* The key gives each result its own empty form. */}
        <div className="mt-8">
          <FeedbackForm key={result.id} checkId={result.id} title={t.feedback.resultTitle} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-2xl font-bold">{t.result.missingTitle}</h1>
      <p className={mutedText}>{t.result.missingText}</p>
      <Link href="/" className={primaryButton}>
        {t.result.another}
      </Link>
    </div>
  );
}
