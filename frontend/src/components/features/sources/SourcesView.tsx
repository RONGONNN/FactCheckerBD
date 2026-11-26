'use client';

import { useEffect, useState } from 'react';
import { ApiError, getSources, type ApiErrorKind } from '../../../lib/api/client';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import type { ApprovedSource } from '../../../types/api';
import { pageTitle, secondaryButton } from '../../ui/styles';
import { SourceGroups } from './SourceGroups';

type State = { sources: ApprovedSource[] } | { error: ApiErrorKind } | null;

export function SourcesView() {
  const { t } = useLanguage();
  const [state, setState] = useState<State>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getSources(controller.signal)
      .then((sources) => setState({ sources }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ error: error instanceof ApiError ? error.kind : 'unexpected' });
      });
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState(null);
    setAttempt((count) => count + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className={pageTitle}>{t.sourcesPage.title}</h1>
      <p>{t.sourcesPage.intro}</p>
      {state === null && <p role="status">{t.sourcesPage.loading}</p>}
      {state && 'error' in state && (
        <div className="flex flex-col items-start gap-2">
          <p role="alert">{t.errors[state.error]}</p>
          <button type="button" className={secondaryButton} onClick={retry}>
            {t.sourcesPage.retry}
          </button>
        </div>
      )}
      {state && 'sources' in state && state.sources.length === 0 && <p>{t.sourcesPage.empty}</p>}
      {state && 'sources' in state && <SourceGroups sources={state.sources} />}
    </div>
  );
}
