import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AppConfig } from '../src/config/appConfig.js';
import { parseEnv } from '../src/config/env.js';
import { activeSources } from '../src/config/sources.js';
import { createCheckRunner } from '../src/services/checkRunner.js';
import { createRateLimiter } from '../src/services/rateLimiter.js';
import { fakeLlm, searchOutput, startApp } from './helpers.js';

async function withApp(
  config: Partial<AppConfig>,
  run: (post: (body: unknown, headers?: object) => Promise<Response>) => Promise<void>,
) {
  const { llm } = fakeLlm(searchOutput());
  const app = await startApp({ llm, sources: activeSources }, config);
  try {
    await run((body, headers = {}) =>
      fetch(`${app.baseUrl}/api/check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }),
    );
  } finally {
    app.close();
  }
}

describe('rate limiting', () => {
  it('blocks a client after its hourly limit, without counting invalid requests', async () => {
    await withApp({ checksPerHour: 2 }, async (post) => {
      assert.equal((await post({})).status, 400);
      assert.equal((await post({ claim: 'a' })).status, 200);
      assert.equal((await post({ claim: 'b' })).status, 200);
      const blocked = await post({ claim: 'c' });
      assert.equal(blocked.status, 429);
      assert.ok(Number(blocked.headers.get('retry-after')) > 0);
      assert.equal((await blocked.json()).error.code, 'RATE_LIMITED');
    });
  });

  it('ignores a forged client address unless a proxy is trusted', async () => {
    const from = (address: string) => ({ 'x-forwarded-for': address });
    await withApp({ checksPerHour: 1 }, async (post) => {
      await post({ claim: 'a' }, from('1.1.1.1'));
      assert.equal((await post({ claim: 'b' }, from('2.2.2.2'))).status, 429);
    });
    await withApp({ checksPerHour: 1, trustProxyHops: 1 }, async (post) => {
      await post({ claim: 'a' }, from('1.1.1.1'));
      assert.equal((await post({ claim: 'b' }, from('2.2.2.2'))).status, 200);
    });
  });

  it('stops paid checks at the daily limit but still serves cached ones', async () => {
    await withApp({ dailyCheckLimit: 1 }, async (post) => {
      assert.equal((await post({ claim: 'a' })).status, 200);
      assert.equal((await post({ claim: 'b' })).status, 429);
      assert.equal((await post({ claim: 'a' })).status, 200);
    });
  });

  it('starts a new window after the old one ends', () => {
    let time = 0;
    const limiter = createRateLimiter(1, 1000, () => time);
    assert.equal(limiter.take('x').allowed, true);
    assert.equal(limiter.take('x').allowed, false);
    time = 1000;
    assert.equal(limiter.take('x').allowed, true);
  });
});

describe('result cache', () => {
  const request = { claim: 'x', language: 'en' } as const;

  it('checks identical claims once, until the entry expires or the day changes', async () => {
    const { llm, calls } = fakeLlm(searchOutput());
    let time = Date.parse('2026-11-26T06:00:00Z');
    const run = createCheckRunner(
      { llm, sources: activeSources },
      { cacheTtlSeconds: 3600, dailyLimit: 10, now: () => time },
    );
    const [first, second] = await Promise.all([run(request), run(request)]);
    assert.equal(calls.search, 1);
    assert.notEqual(first.id, second.id);
    assert.equal(first.checkedAt, second.checkedAt);

    await run({ ...request, language: 'bn' });
    assert.equal(calls.search, 2);
    time += 3_600_000;
    await run(request);
    assert.equal(calls.search, 3);
    time = Date.parse('2026-11-26T17:59:00Z');
    await run(request);
    time = Date.parse('2026-11-26T18:01:00Z'); // just past midnight in Dhaka
    await run(request);
    assert.equal(calls.search, 5);
  });

  it('does not cache failures', async () => {
    const { llm, calls } = fakeLlm(searchOutput());
    const working = llm.search;
    llm.search = async () => {
      llm.search = working;
      throw new Error('temporary');
    };
    const run = createCheckRunner(
      { llm, sources: activeSources },
      { cacheTtlSeconds: 3600, dailyLimit: 10 },
    );
    await assert.rejects(run(request));
    await run(request);
    assert.equal(calls.search, 1);
  });
});

describe('hardening', () => {
  it('sends security headers and refuses an oversized body', async () => {
    await withApp({}, async (post) => {
      const response = await post({ claim: 'a'.repeat(20_000) });
      assert.equal(response.status, 413);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'DENY');
      assert.equal(response.headers.get('x-powered-by'), null);
    });
  });

  it('reduces the frontend URL to its origin', () => {
    const env = parseEnv({ FRONTEND_ORIGIN: 'https://example.org/' });
    assert.equal(env.FRONTEND_ORIGIN, 'https://example.org');
  });
});
