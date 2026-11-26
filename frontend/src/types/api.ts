// Mirrors the backend API responses. The schemas also guard data read back from localStorage.
import { z } from 'zod';

export const MAX_CLAIM_LENGTH = 1000;

const evidenceSchema = z.object({
  text: z.string(),
  sourceIds: z.array(z.number()),
});

const sourceSchema = z.object({
  id: z.number(),
  title: z.string(),
  publisher: z.string(),
  type: z.enum(['factcheck', 'news']),
  // Only web links may ever reach an href.
  url: z.url({ protocol: /^https?$/ }),
  publishedAt: z.string().nullable(),
});

export const checkResultSchema = z.object({
  id: z.string(),
  claim: z.string(),
  verdict: z.enum(['supported', 'contradicted', 'mixed', 'insufficient']),
  explanation: z.string(),
  supporting: z.array(evidenceSchema),
  contradicting: z.array(evidenceSchema),
  sources: z.array(sourceSchema),
  checkedAt: z.string(),
});

export const sourcesResponseSchema = z.object({
  sources: z.array(
    z.object({ name: z.string(), domain: z.hostname(), type: z.enum(['factcheck', 'news']) }),
  ),
});

export const MAX_FEEDBACK_LENGTH = 1000;

export type ApprovedSource = z.infer<typeof sourcesResponseSchema>['sources'][number];
export type CheckResult = z.infer<typeof checkResultSchema>;
export type Source = CheckResult['sources'][number];
export type Evidence = CheckResult['supporting'][number];
export type Verdict = CheckResult['verdict'];
export type Language = 'bn' | 'en';
