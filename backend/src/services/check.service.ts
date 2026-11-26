import { randomUUID } from 'node:crypto';
import type { Source } from '../config/sources.js';
import type { Analysis } from '../schemas/analysis.schema.js';
import type { CheckRequest } from '../schemas/check.schema.js';
import { AppError } from '../utils/AppError.js';
import { dateInDhaka } from '../utils/date.js';
import { analyzeEvidence, insufficientAnalysis } from './analyze.service.js';
import type { LlmClient } from './llm.js';
import { searchEvidence } from './search.service.js';

export interface CheckResult extends Analysis {
  id: string;
  claim: string;
  sources: {
    id: number;
    title: string;
    publisher: string;
    type: Source['type'];
    url: string;
    publishedAt: string | null;
  }[];
  checkedAt: string;
}

export interface CheckDependencies {
  /** Null when no API key is configured. */
  llm: LlmClient | null;
  sources: Source[];
}

export async function checkClaim(
  { claim, language }: CheckRequest,
  { llm, sources }: CheckDependencies,
): Promise<CheckResult> {
  // An empty domain list would let the search use the whole web.
  if (!llm || sources.length === 0) {
    throw new AppError(503, 'UPSTREAM_ERROR', 'Claim checking is not available right now.');
  }

  const now = new Date();
  const retrieved = await searchEvidence(claim, llm, sources, dateInDhaka(now));
  const analysis =
    retrieved.length === 0
      ? insufficientAnalysis(language)
      : await analyzeEvidence(claim, language, retrieved, llm, now);

  return {
    id: randomUUID(),
    claim,
    ...analysis,
    // The search does not report publication dates reliably.
    sources: retrieved.map(({ id, title, publisher, type, url }) => ({
      id,
      title,
      publisher,
      type,
      url,
      publishedAt: null,
    })),
    checkedAt: new Date().toISOString(),
  };
}
