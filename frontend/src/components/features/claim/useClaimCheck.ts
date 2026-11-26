'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ApiError, checkClaim, type ApiErrorKind } from '../../../lib/api/client';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { saveResult } from '../../../lib/storage/results';

export function useClaimCheck(onSuccess: () => void) {
  const router = useRouter();
  const { language } = useLanguage();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<ApiErrorKind | null>(null);
  const request = useRef<AbortController | null>(null);

  // Leaving the page cancels a running check.
  useEffect(() => () => request.current?.abort(), []);

  async function submit(claim: string) {
    const controller = new AbortController();
    request.current = controller;
    setChecking(true);
    setError(null);
    try {
      const result = await checkClaim(claim, language, controller.signal);
      if (controller.signal.aborted) return;
      saveResult(result);
      onSuccess();
      router.push(`/result/${encodeURIComponent(result.id)}`);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(caught instanceof ApiError ? caught.kind : 'unexpected');
    } finally {
      if (request.current === controller) setChecking(false);
    }
  }

  function cancel() {
    request.current?.abort();
    setChecking(false);
  }

  return { checking, error, submit, cancel };
}
