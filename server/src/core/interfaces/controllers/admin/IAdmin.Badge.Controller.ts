import { Request, Response } from 'express';

export interface IAdminBadgeController {
  createBadge(req: Request, res: Response): Promise<void>;
  updateBadge(req: Request, res: Response): Promise<void>;
  listBadge(req: Request, res: Response): Promise<void>;
  unlistBadge(req: Request, res: Response): Promise<void>;
  getAllBadges(req: Request, res: Response): Promise<void>;
}