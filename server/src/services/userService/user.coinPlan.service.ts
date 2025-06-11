import { injectable, inject } from 'inversify';
import { ICoinPlanRepository } from '../../core/interfaces/repositories/ICoinPlanRepository';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IUserCoinPlanService from '../../core/interfaces/services/user/IUser.CoinPlan.Service';
import ICoinTransactionRepository from '../../core/interfaces/repositories/ICoinTransactionRepository';
import { createStripeCheckoutSession } from '../../utils/stripeUtils';
import { stripe } from '../../config/stripe';
import { Types } from 'mongoose';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { ICoinTransaction } from '../../models/CoinTransaction';
import { SafeUser } from '../../core/types/SafeUser';

@injectable()
export class UserCoinPlanService implements IUserCoinPlanService{
  constructor(
    @inject(TYPES.CoinPlanRepository) private coinPlanRepository: ICoinPlanRepository,
    @inject(TYPES.CoinTransactionRepository) private coinTransactionRepo : ICoinTransactionRepository,
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
  ) {}

  async getPlans(): Promise<ICoinPlan[] | null> {
    return await this.coinPlanRepository.getListedPlans();
  }

  async createCoinPlanCheckoutSession(userId: string,planId: string): Promise<{ sessionId: string }> {
    if (!userId || !planId) {
      throw new Error('Missing userId or planId');
    }
    const coinPlan = await this.coinPlanRepository.getCoinPlanById(planId);
    if (!coinPlan || !coinPlan.isListed) {
      throw new Error('Coin plan not found or not available');
    }
    if(coinPlan.coins<50){
      throw new Error('Stripe do not accept payment less than ₹50');
    }
    const sessionId = await createStripeCheckoutSession({
      title: coinPlan.title,
      coins: coinPlan.coins,
      price: coinPlan.price,
      userId: userId,
      planId: planId,
    });
    if(!sessionId){
      throw new Error('session creating failed please try again later');
    }
    return { sessionId };
  }

  async getCheckoutSessionDetails(sessionId: string):
  Promise<{transactionData: ICoinTransaction;updatedUser: SafeUser | null;}> {
    if (!sessionId) throw new Error('Session ID is required');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid') {
      throw new Error('Payment not completed or session not found');
    }
    const metadata = session.metadata;
    if (!metadata || !metadata.userId || !metadata.coins || !session.amount_total) {
      throw new Error('Missing session metadata');
    }
    const userId = new Types.ObjectId(metadata.userId);
    const coins = parseInt(metadata.coins, 10);
    const amount = session.amount_total / 100; 
    const stripePaymentIntentId = session.payment_intent?.toString() || '';
    const existingUser = await this.userRepo.findUserById(metadata.userId);
    const existingTransaction = await this.coinTransactionRepo.findByStripeIntentId(stripePaymentIntentId);
    if (existingTransaction) {
      return {transactionData:existingTransaction,updatedUser:existingUser};
    }
    const updatedUser = await this.userRepo.incrementCoin(metadata.userId,coins);
    const transactionData = await this.coinTransactionRepo.create({
      userId,
      type: 'purchase',
      amount,
      coins,
      stripePaymentIntentId,
    });
    return {transactionData,updatedUser};
  }

  async getTransactionHistoryByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: ICoinTransaction[]; total: number }> {
      return await this.coinTransactionRepo.getByUserId(userId, page, limit);
  }

}