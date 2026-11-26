import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.url({ protocol: /^https?$/ }).default('http://localhost:4000'),
  ),
});

export type PublicEnv = z.infer<typeof envSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
