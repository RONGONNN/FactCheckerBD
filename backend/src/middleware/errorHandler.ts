import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

// body-parser marks bad requests (malformed JSON, oversized body) with a 4xx status.
function isClientError(error: unknown): error is { status: number } {
  if (typeof error !== 'object' || error === null || !('status' in error)) return false;
  return typeof error.status === 'number' && error.status >= 400 && error.status < 500;
}

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (isClientError(error)) {
    return new AppError(error.status, 'VALIDATION_ERROR', 'The request body is not valid.');
  }
  return new AppError(500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const { status, code, message, retryAfterSeconds } = toAppError(error);
  // Details stay in the server log and are never sent to the client.
  if (status >= 500) console.error(error);
  if (retryAfterSeconds) res.set('Retry-After', String(retryAfterSeconds));
  res.status(status).json({ error: { code, message } });
};
