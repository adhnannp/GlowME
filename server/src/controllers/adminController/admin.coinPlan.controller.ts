import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IAdminCoinPlanService } from '../../core/interfaces/services/admin/IAdmin.CoinPlan.Service';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import IAdminCoinPlanController from '../../core/interfaces/controllers/admin/IAdmin.CoinPlan.Controller';

@injectable()
export class AdminCoinPlanController implements IAdminCoinPlanController{
  constructor(
    @inject(TYPES.AdminCoinPlanService) private coinPlanService: IAdminCoinPlanService
  ) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<ICoinPlan> = req.body;
      const coinPlan = await this.coinPlanService.createPlan(data);
      res.status(201).json({
        message: 'Coin plan created successfully',
        data: coinPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const coinPlans = await this.coinPlanService.getAllPlans();
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
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<ICoinPlan> = req.body;
      const updatedPlan = await this.coinPlanService.updatePlan(id, data);
      res.status(200).json({
        message: 'Coin plan updated successfully',
        data: updatedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;    
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async listPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const listedPlan = await this.coinPlanService.listPlan(id);
      res.status(200).json({
        message: 'Coin plan listed successfully',
        data: listedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async unlistPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const unlistedPlan = await this.coinPlanService.unlistPlan(id);
      res.status(200).json({
        message: 'Coin plan unlisted successfully',
        data: unlistedPlan,
      });
      return;
    } catch (err) {
      const error = err as Error;  
      res.status(400).json({ message: error.message });
      return;
    }
  }
}