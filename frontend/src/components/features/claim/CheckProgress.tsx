'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { card, mutedText, secondaryButton } from '../../ui/styles';

// The API answers once, so the second stage is shown after a typical search time.
const SEARCH_STAGE_MS = 10_000;

export function CheckProgress({ onCancel }: { onCancel: () => void }) {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(true), SEARCH_STAGE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${card} flex items-center gap-4`}>
      <span
        aria-hidden="true"
        className="size-6 shrink-0 animate-spin rounded-full border-4 border-slate-300 border-t-blue-700"
      />
      <div role="status" className="flex-1">
        <p className="font-medium">{analyzing ? t.progress.analyzing : t.progress.searching}</p>
        <p className={mutedText}>{t.progress.note}</p>
      </div>
      <button type="button" className={secondaryButton} onClick={onCancel}>
        {t.progress.cancel}
      </button>
    </div>
  );
}
