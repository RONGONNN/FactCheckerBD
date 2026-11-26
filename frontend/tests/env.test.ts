import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parsePublicEnv } from '../src/lib/env';

describe('parsePublicEnv', () => {
  it('defaults to the local API', () => {
    const env = parsePublicEnv({ NEXT_PUBLIC_API_URL: '' });
    assert.equal(env.NEXT_PUBLIC_API_URL, 'http://localhost:4000');
  });

  it('rejects a value that is not an http URL', () => {
    assert.throws(
      () => parsePublicEnv({ NEXT_PUBLIC_API_URL: 'ftp://example.com' }),
      /Invalid environment variables/,
    );
  });
});
