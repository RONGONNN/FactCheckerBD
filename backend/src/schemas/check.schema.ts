import { z } from 'zod';

export const MAX_CLAIM_LENGTH = 1000;

const claimMessage = `claim must be 1 to ${MAX_CLAIM_LENGTH} characters.`;

export const checkRequestSchema = z.object(
  {
    claim: z
      .string(claimMessage)
      .transform((value) => value.replace(/\s+/g, ' ').trim())
      .pipe(z.string().min(1, claimMessage).max(MAX_CLAIM_LENGTH, claimMessage)),
    language: z.enum(['bn', 'en'], 'language must be "bn" or "en".').default('bn'),
  },
  'The request body must be a JSON object.',
);

export type CheckRequest = z.infer<typeof checkRequestSchema>;
export type Language = CheckRequest['language'];
