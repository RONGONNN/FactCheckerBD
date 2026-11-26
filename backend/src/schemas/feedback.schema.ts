import { z } from 'zod';

export const MAX_FEEDBACK_LENGTH = 1000;

const ratingMessage = 'rating must be a whole number from 1 to 5.';
const messageMessage = `message must be at most ${MAX_FEEDBACK_LENGTH} characters.`;

export const feedbackRequestSchema = z.object(
  {
    rating: z.number(ratingMessage).int(ratingMessage).min(1, ratingMessage).max(5, ratingMessage),
    message: z.string(messageMessage).trim().max(MAX_FEEDBACK_LENGTH, messageMessage).optional(),
    checkId: z.string('checkId is not valid.').max(64, 'checkId is not valid.').optional(),
  },
  'The request body must be a JSON object.',
);

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
