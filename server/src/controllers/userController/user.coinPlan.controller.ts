import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import IUserCoinPlanService from '../../core/interfaces/services/user/IUser.CoinPlan.Service';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IUserCoinPlanController from '../../core/interfaces/controllers/user/IUser.CoinPlan.controller';

@injectable()
export class UserCoinPlanController implements IUserCoinPlanController{
  constructor(
    @inject(TYPES.UserCoinPlanService) private coinPlanService: IUserCoinPlanService
  ) {}

  async getCoinPlans(req: Request, res: Response): Promise<void> {
    try {
      const coinPlans = await this.coinPlanService.getPlans();
      if (!coinPlans) {
        res.status(404).json({ message: 'No coin plans found' });
        return;
      }
      res.status(200).json({
        message: 'Coin plans retrieved successfully',
        data: coinPlans,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(400).json({ message: error.message });
      return;
    }
  }

}