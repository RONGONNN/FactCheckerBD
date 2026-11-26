import { createApp } from './app.js';
import { parseEnv } from './config/env.js';
import { activeSources } from './config/sources.js';
import { createFileFeedbackStore } from './services/feedbackStore.js';
import { createOpenAiClient } from './services/openai.service.js';

const env = parseEnv(process.env);
const llm = env.OPENAI_API_KEY ? createOpenAiClient(env.OPENAI_API_KEY, env.OPENAI_MODEL) : null;
if (!llm) console.warn('OPENAI_API_KEY is not set: POST /api/check will answer 503.');

const feedbackStore = createFileFeedbackStore(env.FEEDBACK_FILE);

const app = createApp(
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

app.listen(env.PORT, (error) => {
  if (error) throw error;
  console.log(`API listening on port ${env.PORT}, allowing ${env.FRONTEND_ORIGIN}`);
});
