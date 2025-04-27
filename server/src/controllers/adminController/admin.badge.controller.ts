import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IAdminBadgeService } from '../../core/interfaces/services/admin/IAdmin.Badge.Service';
import { TYPES } from '../../di/types';
import { IAdminBadgeController } from '../../core/interfaces/controllers/admin/IAdmin.Badge.Controller';

@injectable()
export class AdminBadgeController implements IAdminBadgeController{

  constructor(
    @inject(TYPES.AdminBadgeService) private badgeService: IAdminBadgeService
  ) {}

  async createBadge(req: Request, res: Response): Promise<void> {
    try {
      const { name, requiredXp } = req.body;
      const imageFile = req.file;

      if (!name || !requiredXp || !imageFile) {
        res.status(400).json({ message: 'Name, required XP, and image are required' });
        return;
      }

      const parsedRequiredXp = parseInt(requiredXp, 10);
      if (isNaN(parsedRequiredXp) || parsedRequiredXp < 0) {
        res.status(400).json({ message: 'Required XP must be a non-negative number' });
        return;
      }

      const badge = await this.badgeService.createBadge(name, parsedRequiredXp, imageFile);
      res.status(201).json({badge , message:'successfully created the badge'});
    } catch (err) {
        const error = err as Error
        res.status(400).json({ message:error });
        return;
    }
  }

  async updateBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      const { name, requiredXp } = req.body;
      const imageFile = req.file;
  
      if (!badgeId) {
        res.status(400).json({ message: 'Badge ID is required' });
        return;
      }
  
      let parsedRequiredXp: number | undefined;
      if (requiredXp !== undefined) {
        const num = Number(requiredXp);
        if (isNaN(num)) {
          res.status(400).json({ message: 'requiredXp must be a valid number' });
          return;
        }
        if (num < 0) {
          res.status(400).json({ message: 'requiredXp must be a non-negative number' });
          return;
        }
        parsedRequiredXp = num;
      }
  
      if (!name && !imageFile && parsedRequiredXp === undefined) {
        res.status(400).json({
          message: 'At least one of name, requiredXp, or image must be provided',
        });
        return;
      }

      const badge = await this.badgeService.updateBadge(badgeId, name, parsedRequiredXp, imageFile);
      res.status(200).json({ badge, message: 'Successfully updated the badge' });
      return
    } catch (err) {
      const error = err as Error
      res.status(400).json({ message: error.message || 'Failed to update badge' });
      return;
    }
  }

  async listBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      if (!badgeId) {
        res.status(400).json({ message: 'Badge ID is required' });
        return;
      }
      const badge = await this.badgeService.listBadge(badgeId);
      res.status(200).json({ badge, message: 'Badge listed successfully' });
      return
    } catch (error) {
      const err = error as Error
      res.status(400).json({ message: err.message });
    }
  }

  async unlistBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      if (!badgeId) {
        res.status(400).json({ message: 'Badge ID is required' });
        return;
      }
      const badge = await this.badgeService.unlistBadge(badgeId);
      res.status(200).json({ badge, message: 'Badge unlisted successfully' });
    } catch (error) {
      const err = error as Error
      res.status(400).json({ message: err.message });
    }
  }

  async getAllBadges(req: Request, res: Response): Promise<void> {
    try {
      const badges = await this.badgeService.getAllBadges();
      res.status(200).json({badges , message:'successfully fetched all the badge'});
    } catch (error) {
      const err = error as Error
        res.status(400).json({ message:err.message });
        return;
    }
  }
}