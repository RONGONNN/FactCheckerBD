// Entry point for Vercel only. Local and other Node hosts start from src/server.ts.
import type { Express } from 'express';
import { createAppFromEnv } from './src/bootstrap.js';
import { parseEnv } from './src/config/env.js';
import { createLogFeedbackStore } from './src/services/feedbackStore.js';

// Vercel has one proxy in front of the app; without this every visitor shares a rate limit.
const env = parseEnv({ ...process.env, TRUST_PROXY_HOPS: process.env.TRUST_PROXY_HOPS || '1' });

// Vercel's file system is read-only, so feedback goes to the runtime logs.
const app: Express = createAppFromEnv(env, createLogFeedbackStore());

export default app;
