import { randomUUID } from 'node:crypto';
import type { CheckRequest } from '../schemas/check.schema.js';
import { tooManyRequests } from '../utils/AppError.js';
import { isoDateInDhaka } from '../utils/date.js';
import { checkClaim, type CheckDependencies, type CheckResult } from './check.service.js';
import { createRateLimiter } from './rateLimiter.js';

const DAY_MS = 86_400_000;
const MAX_CACHE_ENTRIES = 500;

export interface RunnerOptions {
  cacheTtlSeconds: number;
  /** Paid checks allowed in 24 hours, for all visitors together. */
  dailyLimit: number;
  now?: () => number;
}

/** Adds a result cache and a daily spending guard around checkClaim. */
export function createCheckRunner(dependencies: CheckDependencies, options: RunnerOptions) {
  const now = options.now ?? Date.now;
  const daily = createRateLimiter(options.dailyLimit, DAY_MS, now);
  // Promises are cached, so identical claims arriving together are checked once.
  const cache = new Map<string, { result: Promise<CheckResult>; expiresAt: number }>();

  function start(request: CheckRequest): Promise<CheckResult> {
    if (dependencies.llm) {
      const { allowed, retryAfterSeconds } = daily.take('all');
      if (!allowed) throw tooManyRequests(retryAfterSeconds);
    }
    return checkClaim(request, dependencies);
  }

  return async function run(request: CheckRequest): Promise<CheckResult> {
    // The date is part of the key: "tomorrow" means something else after midnight.
    const day = isoDateInDhaka(new Date(now()));
    const key = JSON.stringify([day, request.language, request.claim]);

    let entry = cache.get(key);
    if (!entry || entry.expiresAt <= now()) {
      const result = start(request);
      entry = { result, expiresAt: now() + options.cacheTtlSeconds * 1000 };
      cache.delete(key);
      cache.set(key, entry);
      const oldest = cache.keys().next().value;
      if (cache.size > MAX_CACHE_ENTRIES && oldest !== undefined) cache.delete(oldest);
      result.catch(() => cache.delete(key));
    }

    // Each visitor gets their own id; checkedAt still says when the check really ran.
    return { ...(await entry.result), id: randomUUID() };
  };
}

export type CheckRunner = ReturnType<typeof createCheckRunner>;
