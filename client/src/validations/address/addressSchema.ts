import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  pincode: z
    .string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^\d+$/, "Pincode must be numeric"),
  landmark: z.string().optional(),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(5, "Address is required"),
});
