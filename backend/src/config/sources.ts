import { z } from 'zod';
import sourcesJson from './sources.json' with { type: 'json' };

const sourceSchema = z.object({
  name: z.string().min(1),
  domain: z.hostname(),
  pathPrefix: z.string().startsWith('/').optional(),
  type: z.enum(['factcheck', 'news']),
  active: z.boolean(),
});

export type Source = z.infer<typeof sourceSchema>;

export const activeSources: Source[] = z
  .array(sourceSchema)
  .parse(sourcesJson)
  .filter((source) => source.active);
