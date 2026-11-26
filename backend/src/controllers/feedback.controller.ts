import type { RequestHandler } from 'express';
import type { FeedbackRequest } from '../schemas/feedback.schema.js';
import type { FeedbackStore } from '../services/feedbackStore.js';

export function createFeedbackController(store: FeedbackStore): RequestHandler {
  return async (req, res) => {
    const feedback = req.body as FeedbackRequest;
    await store.save({ ...feedback, receivedAt: new Date().toISOString() });
    res.status(201).json({ status: 'received' });
  };
}
