'use client';

import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { Verdict } from '../../../types/api';

const STYLES: Record<Verdict, string> = {
  supported: 'bg-emerald-100 text-emerald-900',
  contradicted: 'bg-red-100 text-red-900',
  mixed: 'bg-amber-100 text-amber-900',
  insufficient: 'bg-slate-200 text-slate-900',
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-lg font-bold ${STYLES[verdict]}`}>
      {t.verdicts[verdict]}
    </span>
  );
}
