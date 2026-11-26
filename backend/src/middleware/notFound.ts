import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound: RequestHandler = () => {
  throw new AppError(404, 'NOT_FOUND', 'Resource not found.');
};
