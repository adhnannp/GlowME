import { z } from 'zod';

export const rewardSchema = z.object({
  name: z.string().trim().min(3, 'Name is required'),
  coin: z.number().min(1000,'coin must be greater than 1000').nonnegative('Coin must be non-negative'),
  description: z.string().trim().min(5, 'Description is required'),
});

export const rewardUpdateSchema = rewardSchema.partial(); 