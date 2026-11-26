import { z } from 'zod';
import type { Source } from '../config/sources.js';
import type { Language } from '../schemas/check.schema.js';
import { dateInDhaka } from '../utils/date.js';
import { stripLinks } from '../utils/url.js';
import type { LlmClient } from './llm.js';
import { buildSuggestionPrompt } from './prompts.js';

const COUNT = 3;
const HOUR_MS = 3_600_000;
// One paid call per language covers every visitor for this long.
const FRESH_MS = 12 * HOUR_MS;
// A failure is remembered too, so a broken service is not called on every visit.
const RETRY_MS = HOUR_MS / 6;

export const suggestionsSchema = z.object({ claims: z.array(z.string()) });

function clean(claims: string[]): string[] {
  const texts = claims.map(stripLinks).filter((text) => text.length >= 10 && text.length <= 200);
  return [...new Set(texts)].slice(0, COUNT);
}

export function createExampleProvider(
  llm: LlmClient | null,
  sources: Source[],
  now: () => number = Date.now,
) {
  const cache = new Map<Language, { claims: Promise<string[]>; expiresAt: number }>();
  const domains = sources.filter((source) => source.type === 'factcheck').map((s) => s.domain);

  async function generate(language: Language): Promise<string[]> {
    if (!llm || domains.length === 0) return [];
    const prompt = buildSuggestionPrompt(language, COUNT, dateInDhaka(new Date(now())));
    const parsed = suggestionsSchema.safeParse(await llm.suggest(prompt, domains));
    return parsed.success ? clean(parsed.data.claims) : [];
  }

  /** Resolves to an empty list when there is nothing to suggest; it never rejects. */
  return function getExamples(language: Language): Promise<string[]> {
    const cached = cache.get(language);
    if (cached && cached.expiresAt > now()) return cached.claims;

    const entry = { claims: Promise.resolve<string[]>([]), expiresAt: now() + FRESH_MS };
    entry.claims = generate(language)
      .catch(() => [])
      .then((claims) => {
        if (claims.length === 0) entry.expiresAt = now() + RETRY_MS;
        return claims;
      });
    cache.set(language, entry);
    return entry.claims;
  };
}

export type ExampleProvider = ReturnType<typeof createExampleProvider>;
