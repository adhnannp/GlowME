import mongoose from "mongoose";
import { CoinTransactionType } from "../../models/CoinTransaction";

export type CoinTransactionCreateInput = {
    userId: mongoose.Types.ObjectId;
    type: CoinTransactionType;
    amount: number;
    coins: number;
    stripePaymentIntentId?: string;
  };
  