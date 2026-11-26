import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dateInDhaka, relativeClaimDate } from '../src/utils/date.js';

describe('dateInDhaka', () => {
  it('uses the Bangladesh calendar day, not UTC', () => {
    // 20:00 UTC is already 02:00 the next day in Dhaka.
    assert.match(dateInDhaka(new Date('2026-11-26T20:00:00Z')), /Friday.*27 November 2026/);
  });
});

describe('relativeClaimDate', () => {
  const now = new Date('2026-11-26T06:00:00Z');

  it('reads today and tomorrow in both languages', () => {
    assert.equal(relativeClaimDate('বাংলাদেশে আগামীকাল সব বন্ধ।', now), '2026-11-27');
    assert.equal(relativeClaimDate('আজ ছুটি', now), '2026-11-26');
    assert.equal(relativeClaimDate('Tomorrow is a holiday', now), '2026-11-27');
  });

  it('ignores those letters inside other words', () => {
    assert.equal(relativeClaimDate('সমাজ ও কাজ, আজাদ', now), null);
    assert.equal(relativeClaimDate('Bangladesh became independent in 1971.', now), null);
  });
});
