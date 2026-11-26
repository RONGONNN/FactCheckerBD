'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { MAX_CLAIM_LENGTH } from '../../../types/api';
import { card, focusRing, mutedText, primaryButton, secondaryButton } from '../../ui/styles';
import { CheckProgress } from './CheckProgress';
import { useClaimCheck } from './useClaimCheck';

export function ClaimForm() {
  const { t } = useLanguage();
  const [claim, setClaim] = useState('');
  const [emptyWarning, setEmptyWarning] = useState(false);
  const { checking, error, submit, cancel } = useClaimCheck(() => setClaim(''));

  function updateClaim(value: string) {
    setClaim(value.slice(0, MAX_CLAIM_LENGTH));
    setEmptyWarning(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!claim.trim()) {
      setEmptyWarning(true);
      return;
    }
    void submit(claim.trim());
  }

  const message = emptyWarning ? t.claim.empty : error && t.errors[error];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold md:text-3xl">{t.claim.heading}</h1>
      <form onSubmit={handleSubmit} noValidate className={`${card} flex flex-col gap-3`}>
        <label htmlFor="claim" className="font-medium">
          {t.claim.label}
        </label>
        <textarea
          id="claim"
          rows={5}
          value={claim}
          maxLength={MAX_CLAIM_LENGTH}
          disabled={checking}
          placeholder={t.claim.placeholder}
          aria-describedby="claim-count"
          onChange={(event) => updateClaim(event.target.value)}
          className={`w-full rounded-lg border border-slate-300 bg-transparent p-3 dark:border-slate-700 ${focusRing}`}
        />
        <div className="flex items-center justify-between gap-3">
          <span id="claim-count" className={mutedText}>
            {claim.length} / {MAX_CLAIM_LENGTH}
          </span>
          <button type="submit" className={primaryButton} disabled={checking}>
            {t.claim.submit}
          </button>
        </div>
        {message && (
          <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
            {message}
          </p>
        )}
      </form>

      {checking && <CheckProgress onCancel={cancel} />}

      <section aria-labelledby="examples-title" className="flex flex-col gap-2">
        <h2 id="examples-title" className="font-semibold">
          {t.claim.examplesTitle}
        </h2>
        <ul className="flex flex-col items-start gap-2">
          {t.claim.examples.map((example) => (
            <li key={example}>
              <button
                type="button"
                className={`${secondaryButton} text-left`}
                disabled={checking}
                onClick={() => updateClaim(example)}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className={mutedText}>{t.disclaimer}</p>
      <Link href="/how-it-works" className={`self-start text-sm underline ${focusRing}`}>
        {t.nav.howItWorks}
      </Link>
    </div>
  );
}
