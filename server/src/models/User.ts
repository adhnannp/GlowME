// src/models/User.ts
import mongoose, { Document } from 'mongoose';
import bcrypt from "bcrypt" 

export interface IUser extends Document {
  username: string;
  profile_image?: string;
  password: string;
  email: string;
  isAdmin?: boolean;
  badge?: string;
  xp?: number;
  questions_explored?: number;
  ban_expires_at?: Date;
  isBlock?: boolean;
  created_at?: Date;
  edited_at?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  profile_image: { type: String, default: '' },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  badge: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  questions_explored: { type: Number, default: 0 },
  ban_expires_at: { type: Date, default: null },
  isBlock: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  edited_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(user.password, salt); 
    next();
  } catch (error:any){
    next(error);
  }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);