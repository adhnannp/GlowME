import { z } from 'zod';

export const tagNameSchema = z.string().regex(/^[a-z]+$/, {
  message: 'Tag must be Only lowercase letters and no spaces or special characters',
});
