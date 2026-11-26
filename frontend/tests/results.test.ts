import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { errorKindForStatus } from '../src/lib/api/client';
import { parseResults } from '../src/lib/storage/results';

const result = {
  id: 'a',
  claim: 'claim',
  verdict: 'insufficient',
  explanation: 'text',
  supporting: [],
  contradicting: [],
  sources: [],
  checkedAt: '2026-01-01T00:00:00.000Z',
};

describe('parseResults', () => {
  it('returns nothing for missing or damaged storage', () => {
    for (const raw of [null, '', '{bad', '{}', '5']) assert.deepEqual(parseResults(raw), []);
  });

  it('keeps valid entries and drops broken or unsafe ones', () => {
    const unsafe = {
      ...result,
      id: 'b',
      sources: [
        {
          id: 1,
          title: 't',
          publisher: 'p',
          type: 'news',
          url: 'javascript:alert(1)',
          publishedAt: null,
        },
      ],
    };
    const parsed = parseResults(JSON.stringify([result, unsafe, { id: 'c' }]));
    assert.deepEqual(parsed, [result]);
  });
});

describe('errorKindForStatus', () => {
  it('maps API statuses to user messages', () => {
    assert.deepEqual([400, 429, 500, 502, 503, 504].map(errorKindForStatus), [
      'validation',
      'rateLimited',
      'unexpected',
      'unavailable',
      'unavailable',
      'timeout',
    ]);
  });
});
