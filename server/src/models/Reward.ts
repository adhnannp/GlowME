import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export interface IReward extends Document {
  name: string;
  coverImage?: string;
  description?: string;
  coin: number;
  createdAt: Date;
  updatedAt: Date;
  isListed: boolean;
}

const RewardSchema = new Schema<IReward>(
  {
    name: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
    coin: { type: Number, required: true },
    isListed: {type: Boolean, default:true}
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' } }
);

export const Reward = model<IReward>('Reward', RewardSchema);
