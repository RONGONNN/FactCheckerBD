'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { Verdict } from '../../../types/api';

const STYLES: Record<Verdict, string> = {
  supported: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  contradicted: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
  mixed: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  insufficient: 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200',
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-lg font-bold ${STYLES[verdict]}`}>
      {t.verdicts[verdict]}
    </span>
  );
}
