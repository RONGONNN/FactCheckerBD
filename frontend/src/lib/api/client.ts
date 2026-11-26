import { z } from 'zod';
import {
  checkResultSchema,
  sourcesResponseSchema,
  type ApprovedSource,
  type CheckResult,
  type Language,
} from '../../types/api';
import { parsePublicEnv } from '../env';

// Next.js only inlines NEXT_PUBLIC_ values that are referenced literally.
const { NEXT_PUBLIC_API_URL: API_URL } = parsePublicEnv({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

// A check runs a web search and an analysis, so it can take a while.
const TIMEOUT_MS = 120_000;

export type ApiErrorKind =
  'validation' | 'rateLimited' | 'unavailable' | 'timeout' | 'network' | 'unexpected';

export class ApiError extends Error {
  constructor(readonly kind: ApiErrorKind) {
    super(kind);
    this.name = 'ApiError';
  }
}

export function errorKindForStatus(status: number): ApiErrorKind {
  if (status === 429) return 'rateLimited';
  if (status === 504) return 'timeout';
  if (status === 502 || status === 503) return 'unavailable';
  if (status >= 400 && status < 500) return 'validation';
  return 'unexpected';
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  { body, signal }: { body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const post = body !== undefined;
  let response: Response;
  try {
    response = await fetch(new URL(path, API_URL), {
      method: post ? 'POST' : 'GET',
      headers: post ? { 'content-type': 'application/json' } : undefined,
      body: post ? JSON.stringify(body) : undefined,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch {
    throw new ApiError(timeout.aborted ? 'timeout' : 'network');
  }
  if (!response.ok) throw new ApiError(errorKindForStatus(response.status));

  const result = schema.safeParse(await response.json().catch(() => null));
  if (!result.success) throw new ApiError('unexpected');
  return result.data;
}

export function checkClaim(
  claim: string,
  language: Language,
  signal?: AbortSignal,
): Promise<CheckResult> {
  return request('/api/check', checkResultSchema, { body: { claim, language }, signal });
}

export async function getSources(signal?: AbortSignal): Promise<ApprovedSource[]> {
  const { sources } = await request('/api/sources', sourcesResponseSchema, { signal });
  return sources;
}

export interface Feedback {
  rating: number;
  message?: string;
  checkId?: string;
}

export async function sendFeedback(feedback: Feedback): Promise<void> {
  await request('/api/feedback', z.object({ status: z.literal('received') }), { body: feedback });
}
