import { z } from 'zod';

export const baseQuestionForm = z.object({
  title: z.string().trim().min(10).max(200),
  problemDetails: z.string().trim().min(20).max(5000),
  tags: z.preprocess((val) => {
    if (typeof val === 'string') return JSON.parse(val);
    return val;
  }, z.array(z.string()).min(1).max(5)),
  isBounty: z.preprocess((val) => val === 'true', z.boolean()),
  bountyCoins: z.preprocess((val) => Number(val), z.number().min(11)),
});
