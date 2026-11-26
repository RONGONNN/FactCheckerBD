import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { activeSources } from '../src/config/sources.js';
import { createExampleProvider } from '../src/services/examples.service.js';
import { fakeLlm, searchOutput, startApp } from './helpers.js';

function suggesting(answer: () => unknown) {
  const { llm } = fakeLlm(searchOutput());
  const calls: string[][] = [];
  llm.suggest = async (_prompt, domains) => {
    calls.push(domains);
    return answer();
  };
  return { llm, calls };
}

describe('AI example claims', () => {
  it('cleans the list and asks only fact-checking sites', async () => {
    const long = 'x'.repeat(201);
    const claims = ['  short ', 'First claim to check https://a.example', long];
    const { llm, calls } = suggesting(() => ({
      claims: [
        ...claims,
        'Second claim here',
        'Second claim here',
        'Third claim here',
        'Fourth one',
      ],
    }));
    const result = await createExampleProvider(llm, activeSources)('en');
    assert.deepEqual(result, ['First claim to check', 'Second claim here', 'Third claim here']);
    assert.ok(calls[0]?.includes('rumorscanner.com'));
    assert.ok(!calls[0]?.includes('reuters.com'));
  });

  it('reuses one answer per language until it is stale', async () => {
    let time = 0;
    const { llm, calls } = suggesting(() => ({ claims: ['A claim worth checking'] }));
    const get = createExampleProvider(llm, activeSources, () => time);
    await Promise.all([get('en'), get('en')]);
    assert.equal(calls.length, 1);
    await get('bn');
    assert.equal(calls.length, 2);
    time = 12 * 3_600_000;
    await get('en');
    assert.equal(calls.length, 3);
  });

  it('returns nothing on failure and waits before trying again', async () => {
    let time = 0;
    const { llm, calls } = suggesting(() => {
      throw new Error('down');
    });
    const get = createExampleProvider(llm, activeSources, () => time);
    assert.deepEqual(await get('en'), []);
    assert.deepEqual(await get('en'), []);
    assert.equal(calls.length, 1);
    time = 600_000;
    await get('en');
    assert.equal(calls.length, 2);
  });

  it('answers with an empty list when no key is configured', async () => {
    const app = await startApp({ llm: null, sources: activeSources });
    try {
      const response = await fetch(`${app.baseUrl}/api/examples?language=zz`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { claims: [] });
    } finally {
      app.close();
    }
  });
});
