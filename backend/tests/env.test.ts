import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseEnv } from '../src/config/env.js';

describe('parseEnv', () => {
  it('applies defaults and treats empty values as unset', () => {
    const env = parseEnv({ PORT: '', OPENAI_API_KEY: '' });
    assert.equal(env.PORT, 4000);
    assert.equal(env.OPENAI_API_KEY, undefined);
  });

  it('rejects an invalid port', () => {
    assert.throws(() => parseEnv({ PORT: 'abc' }), /Invalid environment variables/);
  });
});
