import type { RequestHandler } from 'express';

// The API only returns JSON, so the browser needs no permissions at all.
const HEADERS = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000',
  'Cache-Control': 'no-store',
};

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.set(HEADERS);
  next();
};
