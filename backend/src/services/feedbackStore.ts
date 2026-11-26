import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { FeedbackRequest } from '../schemas/feedback.schema.js';

export interface FeedbackRecord extends FeedbackRequest {
  receivedAt: string;
}

/** Swap this implementation for a hosted database without touching the rest of the app. */
export interface FeedbackStore {
  save(record: FeedbackRecord): Promise<void>;
}

/** One JSON object per line, in a local file. */
export function createFileFeedbackStore(path: string): FeedbackStore {
  return {
    async save(record) {
      await mkdir(dirname(path), { recursive: true });
      await appendFile(path, `${JSON.stringify(record)}\n`, 'utf8');
    },
  };
}
