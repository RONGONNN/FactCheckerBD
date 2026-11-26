import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../utils/AppError.js';

/** Replaces the request body with the validated value. */
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'The request body is not valid.';
      throw new AppError(400, 'VALIDATION_ERROR', message);
    }
    req.body = result.data;
    next();
  };
}
