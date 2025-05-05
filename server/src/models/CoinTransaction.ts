import mongoose, { Document } from 'mongoose';

export type CoinTransactionType = 'purchase' | 'reward' | 'refund';

export interface ICoinTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: CoinTransactionType;
  amount: number;
  coins:number;
  created_at?: Date;
  edited_at?: Date;
}

const coinTransactionSchema = new mongoose.Schema<ICoinTransaction>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['purchase', 'reward', 'refund'], required: true },
  amount: { type: Number, required: true },
  coins:{type: Number, required: true},
},{
   timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const CoinTransactionModel = mongoose.model<ICoinTransaction>('CoinTransaction', coinTransactionSchema);
