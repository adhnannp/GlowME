import { z } from 'zod';


export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .nonempty('Password is required');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .nonempty('Username is required');

export const emailSchema = z
  .string()
  .email('Please enter a valid email')
  .nonempty('Email is required');  

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
