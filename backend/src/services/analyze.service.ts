import {
  analysisSchema,
  type Analysis,
  type Evidence,
  type ModelAnalysis,
} from '../schemas/analysis.schema.js';
import type { Language } from '../schemas/check.schema.js';
import { AppError } from '../utils/AppError.js';
import { dateInDhaka, relativeClaimDate } from '../utils/date.js';
import { stripLinks } from '../utils/url.js';
import type { LlmClient } from './llm.js';
import { buildAnalysisPrompt } from './prompts.js';
import type { RetrievedSource } from './search.service.js';

const MAX_ATTEMPTS = 2;

const INSUFFICIENT_EXPLANATION: Record<Language, string> = {
  bn: 'অনুমোদিত উৎসগুলোতে সিদ্ধান্তে আসার মতো যথেষ্ট প্রমাণ পাওয়া যায়নি। এর অর্থ এই নয় যে দাবিটি মিথ্যা।',
  en: 'The approved sources do not give enough evidence for a conclusion. This does not mean the claim is false.',
};

export function insufficientAnalysis(language: Language): Analysis {
  return {
    verdict: 'insufficient',
    explanation: INSUFFICIENT_EXPLANATION[language],
    supporting: [],
    contradicting: [],
  };
}

function cleanEvidence(
  items: ModelAnalysis['evidenceClaimIsTrue'],
  knownIds: Set<number>,
  claimDate: string | null,
): Evidence[] {
  return (
    items
      .filter((item) => item.aboutSameClaim)
      // A claim about one day needs evidence about that very day.
      .filter((item) => claimDate === null || item.eventDate === claimDate)
      .map((item) => ({
        text: stripLinks(item.text),
        sourceIds: [...new Set(item.sourceIds.filter((id) => knownIds.has(id)))],
      }))
      .filter((item) => item.text && item.sourceIds.length > 0)
  );
}

/** A verdict must be backed by evidence that points to a retrieved source. */
function isBacked({ verdict, supporting, contradicting }: Analysis): boolean {
  if (verdict === 'supported') return supporting.length > 0;
  if (verdict === 'contradicted') return contradicting.length > 0;
  if (verdict === 'mixed') return supporting.length + contradicting.length > 0;
  return true;
}

function enforceRules(
  analysis: ModelAnalysis,
  sources: RetrievedSource[],
  language: Language,
  relativeDate: string | null,
): Analysis {
  // The server's own reading of "tomorrow" wins over the model's.
  const claimDate = relativeDate ?? analysis.claimDate;
  const knownIds = new Set(sources.map((source) => source.id));
  const cleaned: Analysis = {
    verdict: analysis.verdict,
    explanation: stripLinks(analysis.explanation),
    supporting: cleanEvidence(analysis.evidenceClaimIsTrue, knownIds, claimDate),
    contradicting: cleanEvidence(analysis.evidenceClaimIsFalse, knownIds, claimDate),
  };
  return isBacked(cleaned) ? cleaned : insufficientAnalysis(language);
}

export async function analyzeEvidence(
  claim: string,
  language: Language,
  sources: RetrievedSource[],
  llm: LlmClient,
  now: Date,
): Promise<Analysis> {
  const prompt = buildAnalysisPrompt(claim, language, sources, dateInDhaka(now));
  const relativeDate = relativeClaimDate(claim, now);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const parsed = analysisSchema.safeParse(await llm.analyze(prompt));
    if (parsed.success) return enforceRules(parsed.data, sources, language, relativeDate);
  }
  throw new AppError(502, 'UPSTREAM_ERROR', 'The analysis service gave an unusable answer.');
}
