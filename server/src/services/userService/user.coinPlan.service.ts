import { injectable, inject } from 'inversify';
import { ICoinPlanRepository } from '../../core/interfaces/repositories/ICoinPlanRepository';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IUserCoinPlanService from '../../core/interfaces/services/user/IUser.CoinPlan.Service';
import ICoinTransactionRepository from '../../core/interfaces/repositories/ICoinTransactionRepository';
import { createStripeCheckoutSession } from '../../utils/stripeUtils';

@injectable()
export class UserCoinPlanService implements IUserCoinPlanService{
  constructor(
    @inject(TYPES.CoinPlanRepository) private coinPlanRepository: ICoinPlanRepository,
    @inject(TYPES.CoinTransactionRepository) private coinTransactionRepo : ICoinTransactionRepository
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
      throw new Error('session creating failed please try again later')
    }
    return { sessionId };
  }

}

// async buyPlan(userId:string,planId:string){

// }