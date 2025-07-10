import { IReward } from '../../../../models/Reward';
import { Express } from 'express';

export interface IAdminRewardService {
  createReward(name: string, coin: number, imageFile: Express.Multer.File, description: string): Promise<IReward>;
  updateReward(
    rewardId: string,
    name?: string,
    coin?: number,
    imageFile?: Express.Multer.File,
    description?: string
  ): Promise<IReward>;
  listReward(rewardId: string): Promise<IReward>
  unlistReward(rewardId: string): Promise<IReward>
  getAllRewards(): Promise<IReward[]>;
  getRewardById(rewardId: string): Promise<IReward>;
}
