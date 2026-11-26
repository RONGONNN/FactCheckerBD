import { Router } from 'express';
import type { AppConfig } from '../config/appConfig.js';
import { createCheckController } from '../controllers/check.controller.js';
import { createExamplesController } from '../controllers/examples.controller.js';
import { createFeedbackController } from '../controllers/feedback.controller.js';
import { getHealth } from '../controllers/health.controller.js';
import { createSourcesController } from '../controllers/sources.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { checkRequestSchema } from '../schemas/check.schema.js';
import { feedbackRequestSchema } from '../schemas/feedback.schema.js';
import type { CheckDependencies } from '../services/check.service.js';
import { createCheckRunner } from '../services/checkRunner.js';
import { createExampleProvider } from '../services/examples.service.js';
import type { FeedbackStore } from '../services/feedbackStore.js';
import { createRateLimiter } from '../services/rateLimiter.js';

const HOUR_MS = 3_600_000;

export interface AppDependencies extends CheckDependencies {
  feedbackStore: FeedbackStore;
}

export function createApiRouter(dependencies: AppDependencies, config: AppConfig): Router {
  const router = Router();
  const runCheck = createCheckRunner(dependencies, {
    cacheTtlSeconds: config.cacheTtlSeconds,
    dailyLimit: config.dailyCheckLimit,
  });

  const getExamples = createExampleProvider(dependencies.llm, dependencies.sources);

  router.get('/health', getHealth);
  router.get('/examples', createExamplesController(getExamples));
  router.get('/sources', createSourcesController(dependencies.sources));
  // Invalid requests cost nothing, so they are rejected before they count against a limit.
  router.post(
    '/check',
    validateBody(checkRequestSchema),
    rateLimit(createRateLimiter(config.checksPerHour, HOUR_MS)),
    createCheckController(runCheck),
  );
  router.post(
    '/feedback',
    validateBody(feedbackRequestSchema),
    rateLimit(createRateLimiter(config.feedbackPerHour, HOUR_MS)),
    createFeedbackController(dependencies.feedbackStore),
  );

  return router;
}
