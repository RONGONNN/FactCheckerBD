import type { RequestHandler } from 'express';
import type { CheckRequest } from '../schemas/check.schema.js';
import type { CheckRunner } from '../services/checkRunner.js';

export function createCheckController(runCheck: CheckRunner): RequestHandler {
  return async (req, res) => {
    res.json(await runCheck(req.body as CheckRequest));
  };
}
