import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { createFileFeedbackStore, type FeedbackRecord } from '../src/services/feedbackStore.js';
import { startApp } from './helpers.js';

async function post(body: unknown, save: (record: FeedbackRecord) => Promise<void>) {
  const app = await startApp({ llm: null, sources: [], feedbackStore: { save } });
  try {
    const response = await fetch(`${app.baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  } finally {
    app.close();
  }
}

describe('POST /api/feedback', () => {
  it('stores only the allowed fields', async () => {
    const saved: FeedbackRecord[] = [];
    const response = await post(
      { rating: 4, message: '  ভালো  ', checkId: 'abc', email: 'x@example.org' },
      async (record) => void saved.push(record),
    );
    assert.equal(response.status, 201);
    const { receivedAt, ...fields } = saved[0] ?? { receivedAt: '' };
    assert.ok(receivedAt);
    assert.deepEqual(fields, { rating: 4, message: 'ভালো', checkId: 'abc' });
  });

  const invalid = [{}, { rating: 0 }, { rating: 6 }, { rating: 2.5 }, { rating: '3' }];
  for (const body of [...invalid, { rating: 3, message: 'a'.repeat(1001) }]) {
    it(`rejects ${JSON.stringify(body).slice(0, 40)}`, async () => {
      let saves = 0;
      const response = await post(body, async () => void (saves += 1));
      assert.equal(response.status, 400);
      assert.equal(saves, 0);
    });
  }

  it('does not leak details when storage fails', async (t) => {
    t.mock.method(console, 'error', () => {});
    const response = await post({ rating: 3 }, async () => {
      throw new Error('disk path D:/secret');
    });
    assert.equal(response.status, 500);
    assert.ok(!JSON.stringify(response.body).includes('secret'));
  });

  it('appends one line per record to the file', async () => {
    const folder = await mkdtemp(join(tmpdir(), 'factcheck-'));
    try {
      const path = join(folder, 'data', 'feedback.jsonl');
      const store = createFileFeedbackStore(path);
      await store.save({ rating: 1, receivedAt: 'a' });
      await store.save({ rating: 5, message: 'দুই\nলাইন', receivedAt: 'b' });
      const lines = (await readFile(path, 'utf8')).trim().split('\n');
      assert.equal(lines.length, 2);
      assert.equal(JSON.parse(lines[1] ?? '').message, 'দুই\nলাইন');
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  });
});
