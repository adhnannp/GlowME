import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IAdminRewardService } from '../../core/interfaces/services/admin/IAdmin.Reward.Service';
import { TYPES } from '../../di/types';
import { IAdminRewardController } from '../../core/interfaces/controllers/admin/IAdmin.Reward.Controller';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminRewardController implements IAdminRewardController {
  constructor(
    @inject(TYPES.AdminRewardService) private rewardService: IAdminRewardService
  ) {}

  async createReward(req: Request, res: Response): Promise<void> {
    try {
      const { name, coin, description } = req.body;
      const imageFile = req.file;

      if (!name || !coin || !description || !imageFile) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_FIELD_REQUIRED });
        return;
      }

      const parsedCoin = parseInt(coin, 10);
      if (isNaN(parsedCoin) || parsedCoin < 0) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.COIN_NON_NEGATIVE });
        return;
      }

      const reward = await this.rewardService.createReward(name, parsedCoin, imageFile, description);
      res.status(STATUS_CODES.CREATED).json({ reward, message: MESSAGES.REWARD_CREATED });
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateReward(req: Request, res: Response): Promise<void> {
    try {
      const { rewardId } = req.params;
      const { name, coin, description } = req.body;
      const imageFile = req.file;

      if (!rewardId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_ID_REQUIRED });
        return;
      }

      let parsedCoin: number | undefined;
      if (coin !== undefined) {
        const num = Number(coin);
        if (isNaN(num)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.VALID_COIN });
          return;
        }
        if (num < 0) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.COIN_NON_NEGATIVE });
          return;
        }
        parsedCoin = num;
      }

      if (!name && !description && !imageFile && parsedCoin === undefined) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_FIELD_REQUIRED });
        return;
      }

      const reward = await this.rewardService.updateReward(
        rewardId,
        name,
        parsedCoin,
        imageFile,
        description
      );
      res.status(STATUS_CODES.OK).json({ reward, message: MESSAGES.REWARD_UPDATED });
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
  }

  async listReward(req: Request, res: Response): Promise<void> {
    try {
      const { rewardId } = req.params;
      if (!rewardId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_ID_REQUIRED });
        return;
      }
      const reward = await this.rewardService.listReward(rewardId);
      res.status(STATUS_CODES.OK).json({ reward, message: MESSAGES.REWARD_LISTED });
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async unlistReward(req: Request, res: Response): Promise<void> {
    try {
      const { rewardId } = req.params;
      if (!rewardId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_ID_REQUIRED });
        return;
      }
      const reward = await this.rewardService.unlistReward(rewardId);
      res.status(STATUS_CODES.OK).json({ reward, message: MESSAGES.REWARD_UNLISTED });
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getAllRewards(req: Request, res: Response): Promise<void> {
    try {
      const rewards = await this.rewardService.getAllRewards();
      res.status(STATUS_CODES.OK).json({ rewards, message: MESSAGES.REWARD_FETCHED });
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getRewardById(req: Request, res: Response): Promise<void> {
    try {
      const { rewardId } = req.params;
      if (!rewardId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REWARD_ID_REQUIRED });
        return;
      }

      const reward = await this.rewardService.getRewardById(rewardId);
      res.status(STATUS_CODES.OK).json({ reward, message: MESSAGES.REWARD_FETCHED });
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }
}
