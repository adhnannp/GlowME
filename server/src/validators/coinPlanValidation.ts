import { z } from 'zod';

export const CoinPlanValidation = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Title must contain only letters and spaces' })
    .optional(),
  coins: z
    .number()
    .min(1, { message: 'Coins must be at least 1' })
    .optional(),
  price: z
    .number()
    .min(1, { message: 'Price must be at least 1' })
    .optional(),
});

export const CreateCoinPlanValidation = CoinPlanValidation.required({
  title: true,
  coins: true,
  price: true,
});

export const UpdateCoinPlanSchema = CoinPlanValidation.partial();