import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import IUserCoinPlanService from '../../core/interfaces/services/user/IUser.CoinPlan.Service';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IUserCoinPlanController from '../../core/interfaces/controllers/user/IUser.CoinPlan.controller';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';

@injectable()
export class UserCoinPlanController implements IUserCoinPlanController{
  constructor(
    @inject(TYPES.UserCoinPlanService) private coinPlanService: IUserCoinPlanService
  ) {}

  async getCoinPlans(req: Request, res: Response): Promise<void> {
    try {
      const coinPlans = await this.coinPlanService.getPlans();
      if (!coinPlans) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_COIN_PLANS_FOUND });
        return;
      }
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLANS_RETRIEVED,
        data: coinPlans,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async createCoinPlanCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { planId } = req.body;
      const userId = req.userId;
      if (!userId || !planId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.COIN_PLAN_SESSION_REQUIRED_FIELDS });
        return;
      }
      const { sessionId } = await this.coinPlanService.createCoinPlanCheckoutSession(userId, planId);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLAN_SESSION_CREATED,
        sessionId,
      });
      return;
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async getCheckoutSessionDetails(req: Request, res: Response): Promise<void>{
    const sessionId = req.params.sessionId;
    try{
      if (!sessionId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.COIN_PLAN_SESSION_DETAILS_MISSING });
        return;
      }
      const {transactionData,updatedUser} = await this.coinPlanService.getCheckoutSessionDetails(sessionId);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLAN_SESSION_DETAILS_RETRIEVED,
        transactionData,
        updatedUser,
      });
      return;
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async getUserTransactionHistory(req: Request, res: Response) : Promise<void> {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page as string) || 1;
        if (!userId || isNaN(page) || page < 1) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_TRANSACTION_HISTORY_INVALID });
          return;
        }
        const limit = 10;
        const { transactions, total } = await this.coinPlanService.getTransactionHistoryByUser(userId, page, limit);
        res.status(STATUS_CODES.OK).json({
            transactions,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
        return;
    } catch (err) {
        const error = err as Error;
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:error.message });
    }
  }

}