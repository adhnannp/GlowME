import mongoose from "mongoose";
import { z } from "zod";


const isValidObjectId = (val: string) => mongoose.Types.ObjectId.isValid(val);

export const AddressSchema = z.object({
  user_id: z.string().refine(isValidObjectId, "Invalid user id").transform(val => new mongoose.Types.ObjectId(val)),
  name: z.string().min(2, "Name must have at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  landmark: z.string().optional(),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(5, "Address must have at least 5 characters"),
});

export const AddressUpdateSchema = AddressSchema.omit({ user_id: true }).partial();

export type AddressCreateInput = z.infer<typeof AddressSchema>;
export type AddressUpdateInput = z.infer<typeof AddressUpdateSchema>;