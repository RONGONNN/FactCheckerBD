'use client';

import { useEffect, useState } from 'react';
import { getExamples } from '../../../lib/api/client';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { Language } from '../../../types/api';
import { mutedText, secondaryButton } from '../../ui/styles';

interface ExampleClaimsProps {
  disabled: boolean;
  onPick: (claim: string) => void;
}

/** AI suggestions, with fixed examples when there are none. */
export function ExampleClaims({ disabled, onPick }: ExampleClaimsProps) {
  const { t, language } = useLanguage();
  const [loaded, setLoaded] = useState<{ language: Language; claims: string[] } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getExamples(language, controller.signal)
      .catch((): string[] => [])
      .then((claims) => {
        if (!controller.signal.aborted) setLoaded({ language, claims });
      });
    return () => controller.abort();
  }, [language]);

  const ready = loaded?.language === language;
  const suggested = ready && loaded.claims.length > 0;
  const claims = suggested ? loaded.claims : t.claim.examples;

  return (
    <section aria-labelledby="examples-title" className="flex flex-col gap-2">
      <h2 id="examples-title" className="font-semibold">
        {suggested ? t.claim.suggestedTitle : t.claim.examplesTitle}
      </h2>
      {!ready && (
        <p role="status" className={mutedText}>
          {t.claim.suggesting}
        </p>
      )}
      <ul className="flex flex-col items-start gap-2">
        {claims.map((claim) => (
          <li key={claim}>
            <button
              type="button"
              className={`${secondaryButton} text-left`}
              disabled={disabled}
              onClick={() => onPick(claim)}
            >
              {claim}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
