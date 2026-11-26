import type { CheckResult, Verdict } from '../types/api';

export const VERDICTS: Verdict[] = ['supported', 'contradicted', 'mixed', 'insufficient'];

export function countByVerdict(results: CheckResult[]): Record<Verdict, number> {
  const counts: Record<Verdict, number> = {
    supported: 0,
    contradicted: 0,
    mixed: 0,
    insufficient: 0,
  };
  for (const { verdict } of results) counts[verdict] += 1;
  return counts;
}

export function filterResults(
  results: CheckResult[],
  query: string,
  verdict: Verdict | 'all',
): CheckResult[] {
  const needle = query.trim().toLocaleLowerCase();
  return results.filter(
    (result) =>
      (verdict === 'all' || result.verdict === verdict) &&
      result.claim.toLocaleLowerCase().includes(needle),
  );
}
