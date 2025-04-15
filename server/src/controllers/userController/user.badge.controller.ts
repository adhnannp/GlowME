// src/controllers/userBadgeController.ts
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IUserBadgeService } from '../../core/interfaces/services/user/IUser.Badge.Service';
import { TYPES } from '../../di/types';
import { IUserBadgeController } from '../../core/interfaces/controllers/user/IUser.Badge.Controller';

@injectable()
export class UserBadgeController implements IUserBadgeController{

  constructor(
    @inject(TYPES.UserBadgeService) private badgeService: IUserBadgeService
  ) {}

  async getAvailableBadges(req: Request, res: Response ): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const badges = await this.badgeService.getAvailableBadges(userId);
      res.status(200).json({badges, message:'success fully fetched all the badges'});
    } catch (error: any) {
        res.status(400).json({ message: error });
        return;
    }
  }

  async unlockBadge(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { badgeId } = req.body;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      if (!badgeId) {
        res.status(400).json({ message: 'Badge ID is required' });
        return;
      }

      const user = await this.badgeService.unlockBadge(userId, badgeId);
      res.status(200).json({user, message:"success fully unlocked the badge"});
    } catch (error: any) {
        res.status(400).json({ message: error });
        return;
    }
  }

  async setCurrentBadge(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { badgeId } = req.body;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      if (!badgeId) {
        res.status(400).json({ message: 'Badge ID is required' });
        return;
      }

      const user = await this.badgeService.setCurrentBadge(userId, badgeId);
      res.status(200).json({user,message:"successfully changed the current badge"});
    } catch (error: any) {
        res.status(400).json({ message: error });
        return;
    }
  }

  async getUserBadges(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const badges = await this.badgeService.getUserBadges(userId);
      res.status(200).json({badges,message:"fetched all badge acquired by the user"});
    } catch (error: any) {
        res.status(400).json({ message: error });
        return;
    }
  }
}