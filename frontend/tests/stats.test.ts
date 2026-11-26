import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatDateTime } from '../src/lib/format';
import { messages } from '../src/lib/i18n/messages';
import { infoPages } from '../src/lib/i18n/pages';
import { countByVerdict, filterResults } from '../src/lib/stats';
import type { CheckResult, Verdict } from '../src/types/api';

function result(id: string, claim: string, verdict: Verdict): CheckResult {
  return {
    id,
    claim,
    verdict,
    explanation: '',
    supporting: [],
    contradicting: [],
    sources: [],
    checkedAt: '2026-01-01T00:00:00.000Z',
  };
}

const results = [
  result('1', 'Padma Bridge claim', 'supported'),
  result('2', 'পদ্মা সেতু', 'mixed'),
  result('3', 'padma river', 'mixed'),
];

describe('history statistics', () => {
  it('counts every verdict, including unused ones', () => {
    assert.deepEqual(countByVerdict(results), {
      supported: 1,
      contradicted: 0,
      mixed: 2,
      insufficient: 0,
    });
  });

  it('filters by text and verdict', () => {
    const ids = (query: string, verdict: Verdict | 'all') =>
      filterResults(results, query, verdict).map((item) => item.id);
    assert.deepEqual(ids(' PADMA ', 'all'), ['1', '3']);
    assert.deepEqual(ids('padma', 'mixed'), ['3']);
    assert.deepEqual(ids('সেতু', 'all'), ['2']);
    assert.deepEqual(ids('', 'contradicted'), []);
  });

  it('does not format an invalid date', () => {
    assert.equal(formatDateTime('not a date', 'bn'), '');
  });
});

describe('translations', () => {
  const shape = (value: unknown): unknown =>
    value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

  it('has the same structure in Bangla and English', () => {
    assert.deepEqual(shape(messages.bn), shape(messages.en));
    assert.deepEqual(shape(infoPages.bn), shape(infoPages.en));
  });
});
