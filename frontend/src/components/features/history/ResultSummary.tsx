'use client';

import Link from 'next/link';
import { formatDateTime } from '../../../lib/format';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { CheckResult } from '../../../types/api';
import { focusRing, mutedText } from '../../ui/styles';

/** One stored check, linking to its result page. */
export function ResultSummary({ result }: { result: CheckResult }) {
  const { t, language } = useLanguage();
  return (
    <Link
      href={`/result/${encodeURIComponent(result.id)}`}
      className={`block min-w-0 flex-1 rounded-lg ${focusRing}`}
    >
      <span className="block font-medium break-words underline-offset-2 hover:underline">
        {result.claim}
      </span>
      <span className={mutedText}>
        {t.verdicts[result.verdict]} · {formatDateTime(result.checkedAt, language)}
      </span>
    </Link>
  );
}
