import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { startApp } from './helpers.js';

describe('CORS', () => {
  it('allows only the frontend origin', async () => {
    const app = await startApp({ llm: null, sources: [] });
    try {
      const preflight = (origin: string) =>
        fetch(`${app.baseUrl}/api/check`, { method: 'OPTIONS', headers: { origin } });

      const allowed = await preflight('http://localhost:3000');
      assert.equal(allowed.status, 204);
      assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000');

      const other = await preflight('https://evil.example');
      assert.equal(other.headers.get('access-control-allow-origin'), null);
    } finally {
      app.close();
    }
  });
});
