// src/models/User.ts
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt'; 


export interface IUserBadge {
  badgeId: mongoose.Types.ObjectId;
  acquiredAt: Date;
}

export interface IUser extends Document {
  username: string;
  profile_image?: string;
  password?: string;
  email: string;
  isAdmin?: boolean;
  badges?: IUserBadge[];
  currentBadge?: mongoose.Types.ObjectId;
  xp?: number;
  coin_balance?:number;
  questions_explored?: number;
  ban_expires_at?: Date|null;
  isGoogleUser?:boolean;
  isBlock?: boolean;
  created_at?: Date;
  edited_at?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  profile_image: { type: String, default: '' },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  badges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
    acquiredAt: { type: Date, default: Date.now }
  }],
  currentBadge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
  xp: { type: Number, default: 0 },
  coin_balance: { type: Number, default: 0 },
  questions_explored: { type: Number, default: 0 },
  ban_expires_at: { type: Date, default: null },
  isGoogleUser: {type:Boolean, default:false},
  isBlock: { type: Boolean, default: false },
},{
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.password || !user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    const error = err as Error;
    next(error);
  }
});


export const UserModel = mongoose.model<IUser>('User', userSchema);