import mongoose, { Document } from 'mongoose';

export interface ICoinPlan extends Document {
  title: string;
  coins: number;
  price: number;
  isListed?: boolean;
  created_at?: Date;
  edited_at?: Date;
}

const coinPlanSchema = new mongoose.Schema<ICoinPlan>({
  title: { type: String, unique:true , required: true },
  coins: { type: Number, required: true },
  price: { type: Number, required: true },
  isListed: { type: Boolean, default: true },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const CoinPlanModel = mongoose.model<ICoinPlan>('CoinPlan', coinPlanSchema);