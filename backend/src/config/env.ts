import { z } from 'zod';
import { defaultConfig } from './appConfig.js';

// An empty line such as `OPENAI_API_KEY=` must count as "not set".
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const optional = <T extends z.ZodType>(schema: T) => z.preprocess(emptyToUndefined, schema);

const integer = (fallback: number, min = 1, max = 1_000_000) =>
  optional(z.coerce.number().int().min(min).max(max).default(fallback));

const envSchema = z.object({
  PORT: integer(4000, 1, 65535),
  NODE_ENV: optional(z.enum(['development', 'test', 'production']).default('development')),
  // Browsers send an origin without a path or trailing slash, so keep only that part.
  FRONTEND_ORIGIN: optional(
    z
      .url({ protocol: /^https?$/ })
      .default(defaultConfig.frontendOrigin)
      .transform((value) => new URL(value).origin),
  ),
  TRUST_PROXY_HOPS: integer(defaultConfig.trustProxyHops, 0, 10),
  RATE_LIMIT_PER_HOUR: integer(defaultConfig.checksPerHour),
  DAILY_CHECK_LIMIT: integer(defaultConfig.dailyCheckLimit),
  FEEDBACK_LIMIT_PER_HOUR: integer(defaultConfig.feedbackPerHour),
  CACHE_TTL_SECONDS: integer(defaultConfig.cacheTtlSeconds, 0, 86_400),
  FEEDBACK_FILE: optional(z.string().default('data/feedback.jsonl')),
  OPENAI_API_KEY: optional(z.string().optional()),
  OPENAI_MODEL: optional(z.string().default('gpt-5.4-mini')),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
