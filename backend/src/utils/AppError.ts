export type ErrorCode =
  'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'UPSTREAM_ERROR' | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function tooManyRequests(retryAfterSeconds: number): AppError {
  const message = 'Too many requests. Please try again later.';
  return new AppError(429, 'RATE_LIMITED', message, retryAfterSeconds);
}
