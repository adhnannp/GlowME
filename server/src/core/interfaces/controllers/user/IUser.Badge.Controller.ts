import { Request, Response } from 'express';

export interface IUserBadgeController {
  getAvailableBadges(req: Request, res: Response): Promise<void>;
  unlockBadge(req: Request, res: Response): Promise<void>;
  setCurrentBadge(req: Request, res: Response): Promise<void>;
  getUserBadges(req: Request, res: Response): Promise<void>;
}
