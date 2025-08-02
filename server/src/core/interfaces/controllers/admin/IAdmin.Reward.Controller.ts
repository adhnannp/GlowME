import { Request, Response } from 'express';

export interface IAdminRewardController {
  createReward(req: Request, res: Response): Promise<void>;
  updateReward(req: Request, res: Response): Promise<void>;
  listReward(req: Request, res: Response): Promise<void>;
  unlistReward(req: Request, res: Response): Promise<void>;
  getAllRewards(req: Request, res: Response): Promise<void>;
  getRewardById(req: Request, res: Response): Promise<void>;
}
