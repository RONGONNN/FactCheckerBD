import type { Express } from 'express';
import { createApp } from './app.js';
import type { Env } from './config/env.js';
import { activeSources } from './config/sources.js';
import type { FeedbackStore } from './services/feedbackStore.js';
import { createOpenAiClient } from './services/openai.service.js';

/** Builds the app from the environment, for both the local server and Vercel. */
export function createAppFromEnv(env: Env, feedbackStore: FeedbackStore): Express {
  const llm = env.OPENAI_API_KEY ? createOpenAiClient(env.OPENAI_API_KEY, env.OPENAI_MODEL) : null;
  if (!llm) console.warn('OPENAI_API_KEY is not set: POST /api/check will answer 503.');

  return createApp(
    { llm, sources: activeSources, feedbackStore },
    {
      frontendOrigin: env.FRONTEND_ORIGIN,
      trustProxyHops: env.TRUST_PROXY_HOPS,
      checksPerHour: env.RATE_LIMIT_PER_HOUR,
      dailyCheckLimit: env.DAILY_CHECK_LIMIT,
      feedbackPerHour: env.FEEDBACK_LIMIT_PER_HOUR,
      cacheTtlSeconds: env.CACHE_TTL_SECONDS,
    },
  );
}
