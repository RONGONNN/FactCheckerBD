// Live check against the real OpenAI API. It costs money: run with `npm run smoke`.
import { parseEnv } from '../src/config/env.js';
import { activeSources } from '../src/config/sources.js';
import { checkClaim } from '../src/services/check.service.js';
import { createOpenAiClient, type Usage } from '../src/services/openai.service.js';

const CLAIMS = [
  { claim: 'বাংলাদেশে আগামীকাল সব শিক্ষাপ্রতিষ্ঠান বন্ধ থাকবে।', language: 'bn' },
  { claim: 'Bangladesh became independent in 1971.', language: 'en' },
] as const;

const env = parseEnv(process.env);
if (!env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in backend/.env. No live test was run.');
  process.exit(1);
}

for (const request of CLAIMS) {
  const usage: Usage[] = [];
  const llm = createOpenAiClient(env.OPENAI_API_KEY, env.OPENAI_MODEL, (item) => usage.push(item));
  const started = Date.now();
  const result = await checkClaim(request, { llm, sources: activeSources });

  console.log(`\n${result.claim}\nverdict: ${result.verdict}\n${result.explanation}`);
  for (const source of result.sources) console.log(`  [${source.id}] ${source.url}`);
  console.log(`seconds: ${(Date.now() - started) / 1000}`);
  console.table(usage);
}
