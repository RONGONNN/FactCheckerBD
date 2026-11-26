import { checkResultSchema, type CheckResult } from '../../types/api';
import { createBrowserStore } from './browserStore';

export const MAX_STORED_RESULTS = 100;

export const resultsStore = createBrowserStore('factcheck.results');

/** Newest first. Damaged entries are dropped instead of breaking the page. */
export function parseResults(raw: string | null): CheckResult[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.flatMap((item) => {
    const parsed = checkResultSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

export function saveResult(result: CheckResult): void {
  const others = parseResults(resultsStore.read()).filter((item) => item.id !== result.id);
  resultsStore.write(JSON.stringify([result, ...others].slice(0, MAX_STORED_RESULTS)));
}

export function removeResult(id: string): void {
  const remaining = parseResults(resultsStore.read()).filter((item) => item.id !== id);
  resultsStore.write(JSON.stringify(remaining));
}

export function clearResults(): void {
  resultsStore.write('[]');
}
