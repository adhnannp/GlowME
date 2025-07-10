import { z } from 'zod';

export const baseAnswerForm = z.object({
  answer: z.string().trim().min(10, "Answer must be at least 10 characters").max(5000, "Answer too long"),
  quality: z.enum(['ordinary']).optional(),
});
