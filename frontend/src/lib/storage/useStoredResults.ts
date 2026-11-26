'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { CheckResult } from '../../types/api';
import { parseResults, resultsStore } from './results';

/** `undefined` during the server render, where browser storage cannot be read yet. */
export function useStoredResults(): CheckResult[] | undefined {
  const raw = useSyncExternalStore(resultsStore.subscribe, resultsStore.read, () => undefined);
  return useMemo(() => (raw === undefined ? undefined : parseResults(raw)), [raw]);
}
