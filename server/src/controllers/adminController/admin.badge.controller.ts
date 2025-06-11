import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IAdminBadgeService } from '../../core/interfaces/services/admin/IAdmin.Badge.Service';
import { TYPES } from '../../di/types';
import { IAdminBadgeController } from '../../core/interfaces/controllers/admin/IAdmin.Badge.Controller';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

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
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_FIELD_REQUIRED });
        return;
      }

      const parsedRequiredXp = parseInt(requiredXp, 10);
      if (isNaN(parsedRequiredXp) || parsedRequiredXp < 0) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.XP_NON_NEGETIVE });
        return;
      }

      const badge = await this.badgeService.createBadge(name, parsedRequiredXp, imageFile);
      res.status(STATUS_CODES.CREATED).json({badge , message: MESSAGES.BADGE_CREATED});
    } catch (err) {
        const error = err as Error;
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:error });
        return;
    }
  }

  async updateBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      const { name, requiredXp } = req.body;
      const imageFile = req.file;
  
      if (!badgeId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_ID_REQUIRED });
        return;
      }
  
      let parsedRequiredXp: number | undefined;
      if (requiredXp !== undefined) {
        const num = Number(requiredXp);
        if (isNaN(num)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message:MESSAGES.VALID_XP });
          return;
        }
        if (num < 0) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.XP_NON_NEGETIVE });
          return;
        }
        parsedRequiredXp = num;
      }
  
      if (!name && !imageFile && parsedRequiredXp === undefined) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: MESSAGES.BADGE_FIELD_ONE_REQUIRED,
        });
        return;
      }

      const badge = await this.badgeService.updateBadge(badgeId, name, parsedRequiredXp, imageFile);
      res.status(STATUS_CODES.OK).json({ badge, message: MESSAGES.BADGE_UPDATED });
      return;
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
      return;
    }
  }

  async listBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      if (!badgeId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_ID_REQUIRED });
        return;
      }
      const badge = await this.badgeService.listBadge(badgeId);
      res.status(STATUS_CODES.OK).json({ badge, message: MESSAGES.BADGE_LISTED });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async unlistBadge(req: Request, res: Response): Promise<void> {
    try {
      const { badgeId } = req.params;
      if (!badgeId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BADGE_ID_REQUIRED });
        return;
      }
      const badge = await this.badgeService.unlistBadge(badgeId);
      res.status(STATUS_CODES.OK).json({ badge, message: MESSAGES.BADGE_UNLISTED });
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getAllBadges(req: Request, res: Response): Promise<void> {
    try {
      const badges = await this.badgeService.getAllBadges();
      res.status(STATUS_CODES.OK).json({badges , message:MESSAGES.BADGE_FETCHED});
    } catch (error) {
      const err = error as Error;
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:err.message });
        return;
    }
  }
}