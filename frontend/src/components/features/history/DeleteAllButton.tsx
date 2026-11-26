'use client';

import { useState } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { clearResults } from '../../../lib/storage/results';
import { secondaryButton } from '../../ui/styles';

/** Deleting everything takes a second click. */
export function DeleteAllButton() {
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className={`self-start ${secondaryButton}`}
        onClick={() => setConfirming(true)}
      >
        {t.history.removeAll}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`${secondaryButton} border-red-600 text-red-700`}
        onClick={() => {
          clearResults();
          setConfirming(false);
        }}
      >
        {t.history.confirmRemoveAll}
      </button>
      <button type="button" className={secondaryButton} onClick={() => setConfirming(false)}>
        {t.history.cancel}
      </button>
    </div>
  );
}
