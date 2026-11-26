import type { RequestHandler } from 'express';
import type { ExampleProvider } from '../services/examples.service.js';

export function createExamplesController(getExamples: ExampleProvider): RequestHandler {
  return async (req, res) => {
    const language = req.query.language === 'en' ? 'en' : 'bn';
    res.json({ claims: await getExamples(language) });
  };
}
