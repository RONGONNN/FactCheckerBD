import type { RequestHandler } from 'express';
import type { Source } from '../config/sources.js';

export function createSourcesController(sources: Source[]): RequestHandler {
  const body = { sources: sources.map(({ name, domain, type }) => ({ name, domain, type })) };
  return (_req, res) => {
    res.json(body);
  };
}
