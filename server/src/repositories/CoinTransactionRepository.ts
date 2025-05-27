import {
  CoinTransactionModel,
  ICoinTransaction,
} from "../models/CoinTransaction";
import ICoinTransactionRepository from "../core/interfaces/repositories/ICoinTransactionRepository";
import { injectable } from "inversify";
import { CoinTransactionCreateInput } from "../core/types/CreateCoinTransaction";

@injectable()
export class CoinTransactionRepository implements ICoinTransactionRepository {

    async create(input: CoinTransactionCreateInput): Promise<ICoinTransaction> {
        return await CoinTransactionModel.create(input);
    }

    async getById(transactionId: string): Promise<ICoinTransaction | null> {
        return await CoinTransactionModel.findById(transactionId)
        .populate({
            path: "userId",
            select: "-password",
        })
        .lean();
    }

    async findByStripeIntentId(intentId: string): Promise<ICoinTransaction | null> {
        return await CoinTransactionModel.findOne({ stripePaymentIntentId: intentId });
    }      

    async getAll(
        page: number = 1,
        limit: number = 10
    ): Promise<ICoinTransaction[]> {
        return await CoinTransactionModel.find()
        .populate({
            path: "userId",
            select: "-password",
        })
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    async getByUserId(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{transactions:ICoinTransaction[],total:number}> {
        const [transactions, total] = await Promise.all([
            CoinTransactionModel.find({ userId })
                .sort({ created_at: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            CoinTransactionModel.countDocuments({ userId })
        ]);
        return { transactions, total };
    }
}
