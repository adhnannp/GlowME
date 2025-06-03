import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IUserBadgeService } from '../../core/interfaces/services/user/IUser.Badge.Service';
import { TYPES } from '../../di/types';
import { IUserBadgeController } from '../../core/interfaces/controllers/user/IUser.Badge.Controller';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class UserBadgeController implements IUserBadgeController{

  constructor(
    @inject(TYPES.UserBadgeService) private badgeService: IUserBadgeService
  ) {}

  async getAvailableBadges(req: Request, res: Response ): Promise<void> {
    try {
      const {userId} = req.params;
      if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
        return;
      }

      const badges = await this.badgeService.getAvailableBadges(userId);
      res.status(STATUS_CODES.OK).json({badges, message: MESSAGES.BADGE_FETCHED });
    } catch (error) {
        const err= error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return;
    }
  }

  async unlockBadge(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { badgeId } = req.body;

      if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
        return;
      }
      if (!badgeId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_ID_REQUIRED });
        return;
      }

      const user = await this.badgeService.unlockBadge(userId, badgeId);
      res.status(STATUS_CODES.OK).json({user, message: MESSAGES.BADGE_UNLOCKED });
    } catch (error) {
        const err = error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return;
    }
  }

  async setCurrentBadge(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { badgeId } = req.body;

      if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
        return;
      }
      if (!badgeId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_ID_REQUIRED });
        return;
      }

      const user = await this.badgeService.setCurrentBadge(userId, badgeId);
      res.status(STATUS_CODES.OK).json({user,message: MESSAGES.CURRENT_BADGE_CHANGED });
    } catch (error) {
        const err = error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return;
    }
  }

  async getUserBadges(req: Request, res: Response): Promise<void> {
    try {
      const {userId} = req.params;
      if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
        return;
      }

      const badges = await this.badgeService.getUserBadges(userId);
      res.status(STATUS_CODES.OK).json({badges,message: MESSAGES.FETCHED_USER_BADGES });
    } catch (error) {
        const err = error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return;
    }
  }
}