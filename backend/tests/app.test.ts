import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { activeSources } from '../src/config/sources.js';
import { startApp } from './helpers.js';

describe('HTTP app', () => {
  let app: Awaited<ReturnType<typeof startApp>>;

  before(async () => {
    app = await startApp({ llm: null, sources: activeSources });
  });

  after(() => {
    app.close();
  });

  it('greets visitors on the root path', async () => {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      message: 'FactCheckerBD API is running.',
      health: '/api/health',
    });
  });

  it('reports health', async () => {
    const response = await fetch(`${app.baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });

  it('lists active sources without internal fields', async () => {
    const response = await fetch(`${app.baseUrl}/api/sources`);
    const { sources } = await response.json();
    assert.equal(sources.length, activeSources.length);
    assert.deepEqual(Object.keys(sources[0]), ['name', 'domain', 'type']);
  });

  it('returns the error format for unknown routes', async () => {
    const response = await fetch(`${app.baseUrl}/api/unknown`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: { code: 'NOT_FOUND', message: 'Resource not found.' },
    });
  });

  it('rejects malformed JSON without leaking details', async () => {
    const response = await fetch(`${app.baseUrl}/api/check`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{bad',
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: { code: 'VALIDATION_ERROR', message: 'The request body is not valid.' },
    });
  });
});
