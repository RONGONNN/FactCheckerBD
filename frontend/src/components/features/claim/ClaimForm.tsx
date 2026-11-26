'use client';

import { useState, type FormEvent } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { MAX_CLAIM_LENGTH } from '../../../types/api';
import { card, field, mutedText, primaryButton, sectionTitle } from '../../ui/styles';
import { CheckProgress } from './CheckProgress';
import { ExampleClaims } from './ExampleClaims';
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
      <h2 className={sectionTitle}>{t.claim.heading}</h2>
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
          className={`scroll-mt-40 ${field}`}
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
          <p role="alert" className="text-sm font-medium text-red-700">
            {message}
          </p>
        )}
      </form>

      {checking && <CheckProgress onCancel={cancel} />}

      <ExampleClaims disabled={checking} onPick={updateClaim} />

      <p className={mutedText}>{t.disclaimer}</p>
    </div>
  );
}
