import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../src/app.js';
import type { AppConfig } from '../src/config/appConfig.js';
import type { AppDependencies } from '../src/routes/index.js';
import type { LlmClient, SearchOutput } from '../src/services/llm.js';

type TestDependencies = Omit<AppDependencies, 'feedbackStore'> & Partial<AppDependencies>;

export async function startApp(dependencies: TestDependencies, config: Partial<AppConfig> = {}) {
  const app = createApp(
    {
      feedbackStore: { save: async () => {} },
      ...dependencies,
    },
    config,
  );
  const server: Server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  return { baseUrl, close: () => server.close() };
}

export function searchOutput(...urls: string[]): SearchOutput {
  const lines = urls.map((_, index) => `Finding ${index + 1}`);
  const text = lines.join('\n');
  return {
    text,
    citations: urls.map((url, index) => ({
      url,
      title: `Title ${index + 1}`,
      startIndex: text.indexOf(`Finding ${index + 1}`),
    })),
  };
}

/** A fake model that records how often each step ran. */
export function fakeLlm(output: SearchOutput, ...answers: unknown[]) {
  const calls = { search: 0, analyze: 0, domains: [] as string[] };
  const llm: LlmClient = {
    async search(_prompt, domains) {
      calls.search += 1;
      calls.domains = domains;
      return output;
    },
    async analyze() {
      calls.analyze += 1;
      return answers[Math.min(calls.analyze, answers.length) - 1];
    },
    async suggest() {
      return { claims: [] };
    },
  };
  return { llm, calls };
}
