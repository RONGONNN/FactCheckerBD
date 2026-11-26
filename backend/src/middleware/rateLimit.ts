import type { RequestHandler } from 'express';
import type { RateLimiter } from '../services/rateLimiter.js';
import { tooManyRequests } from '../utils/AppError.js';

/** Limits requests per client address. */
export function rateLimit(limiter: RateLimiter): RequestHandler {
  return (req, _res, next) => {
    const { allowed, retryAfterSeconds } = limiter.take(req.ip ?? 'unknown');
    if (!allowed) throw tooManyRequests(retryAfterSeconds);
    next();
  };
}
