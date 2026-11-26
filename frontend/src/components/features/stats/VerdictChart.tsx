'use client';

import { formatNumber } from '../../../lib/format';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { VERDICTS } from '../../../lib/stats';
import type { Verdict } from '../../../types/api';

// One measure, so one hue; every bar is named and numbered in text.
export function VerdictChart({ counts }: { counts: Record<Verdict, number> }) {
  const { t, language } = useLanguage();
  const largest = Math.max(1, ...VERDICTS.map((verdict) => counts[verdict]));

  return (
    <ul className="flex flex-col gap-3">
      {VERDICTS.map((verdict) => (
        <li key={verdict} title={`${t.verdicts[verdict]}: ${counts[verdict]}`}>
          <div className="flex justify-between gap-3 text-sm">
            <span>{t.verdicts[verdict]}</span>
            <span className="font-semibold tabular-nums">
              {formatNumber(counts[verdict], language)}
            </span>
          </div>
          <div aria-hidden="true" className="mt-1 h-2.5 border-l border-slate-400">
            <div
              className="h-full rounded-r bg-[#2a78d6]"
              style={{ width: `${(counts[verdict] / largest) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
