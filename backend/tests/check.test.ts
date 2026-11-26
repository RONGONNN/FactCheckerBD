import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { activeSources } from '../src/config/sources.js';
import type { CheckDependencies } from '../src/services/check.service.js';
import type { Prompt } from '../src/services/llm.js';
import { dateInDhaka, isoDateInDhaka } from '../src/utils/date.js';
import { fakeLlm, searchOutput, startApp } from './helpers.js';

const ARTICLE = 'https://www.rumorscanner.com/fact-check/example';

const answer = {
  claimDate: null,
  verdict: 'contradicted',
  explanation: 'Denied, see https://invented.example/page',
  evidenceClaimIsTrue: [],
  evidenceClaimIsFalse: [
    { text: 'It is denied.', sourceIds: [1, 99], aboutSameClaim: true, eventDate: null },
  ],
};

async function post(dependencies: CheckDependencies, body: unknown) {
  const app = await startApp(dependencies);
  try {
    const response = await fetch(`${app.baseUrl}/api/check`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  } finally {
    app.close();
  }
}

describe('POST /api/check validation', () => {
  const invalid = [{}, { claim: '   ' }, { claim: 'a'.repeat(1001) }, { claim: 5 }, []];

  for (const body of [...invalid, { claim: 'x', language: 'fr' }]) {
    it(`rejects ${JSON.stringify(body).slice(0, 40)}`, async () => {
      const { llm, calls } = fakeLlm(searchOutput());
      const response = await post({ llm, sources: activeSources }, body);
      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'VALIDATION_ERROR');
      assert.equal(calls.search, 0);
    });
  }
});

describe('POST /api/check', () => {
  it('normalizes the claim and searches only active domains', async () => {
    const { llm, calls } = fakeLlm(searchOutput(ARTICLE), answer);
    const response = await post({ llm, sources: activeSources }, { claim: '  দাবি \n  এক  ' });
    assert.equal(response.body.claim, 'দাবি এক');
    assert.deepEqual(
      calls.domains,
      activeSources.map((source) => source.domain),
    );
    assert.ok(!calls.domains.includes('factcheckbd.com'));
  });

  it('drops unapproved, duplicate, invented links and unknown source ids', async () => {
    const output = searchOutput(
      `${ARTICLE}?utm_source=openai`,
      ARTICLE,
      'https://evil.example/rumorscanner.com',
      'https://notrumorscanner.com/page',
      'javascript:alert(1)',
    );
    const { llm } = fakeLlm(output, answer);
    const { status, body } = await post({ llm, sources: activeSources }, { claim: 'x' });

    assert.equal(status, 200);
    assert.deepEqual(
      body.sources.map((source: { url: string }) => source.url),
      [ARTICLE],
    );
    assert.equal(body.sources[0].publisher, 'Rumor Scanner');
    assert.deepEqual(body.contradicting[0].sourceIds, [1]);
    assert.ok(!body.explanation.includes('http'));
  });

  it('answers insufficient without analysis when there are no sources', async () => {
    const { llm, calls } = fakeLlm(searchOutput('https://evil.example/a'), answer);
    const { body } = await post({ llm, sources: activeSources }, { claim: 'x', language: 'en' });
    assert.equal(body.verdict, 'insufficient');
    assert.match(body.explanation, /does not mean the claim is false/);
    assert.equal(calls.analyze, 0);
  });

  it('downgrades a verdict that no retrieved source backs', async () => {
    const unbacked = {
      ...answer,
      evidenceClaimIsFalse: [
        { text: 'Denied.', sourceIds: [42], aboutSameClaim: true, eventDate: null },
      ],
    };
    const { llm } = fakeLlm(searchOutput(ARTICLE), unbacked);
    const { body } = await post({ llm, sources: activeSources }, { claim: 'x' });
    assert.equal(body.verdict, 'insufficient');
    assert.deepEqual(body.contradicting, []);
  });

  it('ignores evidence about another date or event', async () => {
    const stale = {
      ...answer,
      evidenceClaimIsFalse: [
        {
          text: 'An older rumour was false.',
          sourceIds: [1],
          aboutSameClaim: false,
          eventDate: null,
        },
      ],
    };
    const { llm } = fakeLlm(searchOutput(ARTICLE), stale);
    const { body } = await post({ llm, sources: activeSources }, { claim: 'x' });
    assert.equal(body.verdict, 'insufficient');
    assert.deepEqual(body.contradicting, []);
  });

  it('requires same-day evidence for a claim about tomorrow', async () => {
    const check = async (eventDate: string | null) => {
      const dated = {
        ...answer,
        evidenceClaimIsFalse: [
          { text: 'Denied.', sourceIds: [1], aboutSameClaim: true, eventDate },
        ],
      };
      const { llm } = fakeLlm(searchOutput(ARTICLE), dated);
      const claim = 'Schools close tomorrow';
      return (await post({ llm, sources: activeSources }, { claim })).body.verdict;
    };
    assert.equal(await check(null), 'insufficient');
    assert.equal(await check('2024-04-28'), 'insufficient');
    assert.equal(await check(isoDateInDhaka(new Date(), 1)), 'contradicted');
  });

  it('tells both model steps the current date and hides internal fields', async () => {
    const { llm } = fakeLlm(searchOutput(ARTICLE), answer);
    const inputs: string[] = [];
    const spy = {
      search: (prompt: Prompt, domains: string[]) => {
        inputs.push(prompt.input);
        return llm.search(prompt, domains);
      },
      analyze: (prompt: Prompt) => {
        inputs.push(prompt.input);
        return llm.analyze(prompt);
      },
    };
    const { body } = await post({ llm: spy, sources: activeSources }, { claim: 'x' });
    const today = dateInDhaka(new Date());
    assert.deepEqual(
      inputs.map((input) => JSON.parse(input).today),
      [today, today],
    );
    assert.deepEqual(Object.keys(body.contradicting[0]), ['text', 'sourceIds']);
  });

  it('retries once after a badly formatted answer', async () => {
    const { llm, calls } = fakeLlm(searchOutput(ARTICLE), null, answer);
    const response = await post({ llm, sources: activeSources }, { claim: 'x' });
    assert.equal(response.status, 200);
    assert.equal(calls.analyze, 2);
  });

  it('fails cleanly when the answer stays badly formatted', async (t) => {
    t.mock.method(console, 'error', () => {});
    const { llm, calls } = fakeLlm(searchOutput(ARTICLE), { verdict: 'true' });
    const response = await post({ llm, sources: activeSources }, { claim: 'x' });
    assert.equal(response.status, 502);
    assert.equal(response.body.error.code, 'UPSTREAM_ERROR');
    assert.equal(calls.analyze, 2);
  });

  it('does not leak details when the model client crashes', async (t) => {
    t.mock.method(console, 'error', () => {});
    const { llm } = fakeLlm(searchOutput());
    llm.search = async () => {
      throw new Error('secret internal detail');
    };
    const response = await post({ llm, sources: activeSources }, { claim: 'x' });
    assert.equal(response.status, 500);
    assert.ok(!JSON.stringify(response.body).includes('secret'));
  });

  it('answers 503 without an API key or without active sources', async (t) => {
    t.mock.method(console, 'error', () => {});
    const { llm, calls } = fakeLlm(searchOutput());
    for (const dependencies of [
      { llm: null, sources: activeSources },
      { llm, sources: [] },
    ]) {
      const response = await post(dependencies, { claim: 'x' });
      assert.equal(response.status, 503);
    }
    assert.equal(calls.search, 0);
  });
});
