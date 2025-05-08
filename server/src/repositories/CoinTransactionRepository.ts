import { Types } from "mongoose";
import {
  CoinTransactionModel,
  ICoinTransaction,
} from "../models/CoinTransaction";
import ICoinTransactionRepository from "../core/interfaces/repositories/ICoinTransactionRepository";
import { injectable } from "inversify";

@injectable()
export class CoinTransactionRepository implements ICoinTransactionRepository {

    async create(input: ICoinTransaction): Promise<ICoinTransaction> {
        return await CoinTransactionModel.create({
        userId: input.userId,
        type: input.type,
        amount: input.amount,
        coins: input.coins,
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripeChargeId: input.stripeChargeId,
        });
    }

    async getById(transactionId: string): Promise<ICoinTransaction | null> {
        return await CoinTransactionModel.findById(transactionId)
        .populate({
            path: "userId",
            select: "-password",
        })
        .lean();
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
    ): Promise<ICoinTransaction[]> {
        return await CoinTransactionModel.find({
        userId: new Types.ObjectId(userId),
        })
        .populate({
            path: "userId",
            select: "-password",
        })
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }
}
