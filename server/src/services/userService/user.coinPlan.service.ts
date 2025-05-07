import { injectable, inject } from 'inversify';
import { ICoinPlanRepository } from '../../core/interfaces/repositories/ICoinPlanRepository';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IUserCoinPlanService from '../../core/interfaces/services/user/IUser.CoinPlan.Service';

@injectable()
export class UserCoinPlanService implements IUserCoinPlanService{
  constructor(
    @inject(TYPES.CoinPlanRepository) private coinPlanRepository: ICoinPlanRepository
  ) {}

  async getPlans(): Promise<ICoinPlan[] | null> {
    return await this.coinPlanRepository.getListedPlans();
  }
  
}