import { z } from 'zod';

const evidenceSchema = z.object({
  text: z.string(),
  sourceIds: z.array(z.number().int()),
});

// The model must also state what each point is about, so the server can check it.
const modelEvidenceSchema = evidenceSchema.extend({
  aboutSameClaim: z.boolean(),
  /** YYYY-MM-DD of the event described, when the findings show it. */
  eventDate: z.string().nullable(),
});

/** The exact shape the model must return in step 2. */
export const analysisSchema = z.object({
  /** YYYY-MM-DD when the claim is about one particular day, otherwise null. */
  claimDate: z.string().nullable(),
  verdict: z.enum(['supported', 'contradicted', 'mixed', 'insufficient']),
  explanation: z.string().min(1),
  /** Named after the claim, so a debunk is not listed as "supporting" the verdict. */
  evidenceClaimIsTrue: z.array(modelEvidenceSchema),
  evidenceClaimIsFalse: z.array(modelEvidenceSchema),
});

export type ModelAnalysis = z.infer<typeof analysisSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Analysis = {
  verdict: ModelAnalysis['verdict'];
  explanation: string;
  supporting: Evidence[];
  contradicting: Evidence[];
};
