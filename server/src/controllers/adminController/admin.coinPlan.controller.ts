import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IAdminCoinPlanService } from '../../core/interfaces/services/admin/IAdmin.CoinPlan.Service';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IAdminCoinPlanController from '../../core/interfaces/controllers/admin/IAdmin.CoinPlan.Controller';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';


@injectable()
export class AdminCoinPlanController implements IAdminCoinPlanController{
  constructor(
    @inject(TYPES.AdminCoinPlanService) private coinPlanService: IAdminCoinPlanService
  ) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<ICoinPlan> = req.body;
      const coinPlan = await this.coinPlanService.createPlan(data);
      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.COIN_PLAN_CREATED,
        data: coinPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const coinPlans = await this.coinPlanService.getAllPlans();
      if (!coinPlans) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.NO_COIN_PLANS_FOUND });
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

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<ICoinPlan> = req.body;
      const updatedPlan = await this.coinPlanService.updatePlan(id, data);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLAN_UPDATED,
        data: updatedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;    
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async listPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const listedPlan = await this.coinPlanService.listPlan(id);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLAN_LISTED,
        data: listedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async unlistPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const unlistedPlan = await this.coinPlanService.unlistPlan(id);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.COIN_PLAN_UNLISTED,
        data: unlistedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }
}