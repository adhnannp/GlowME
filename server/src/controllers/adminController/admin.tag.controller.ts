import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../di/types';
import { IAdminTagController } from '../../core/interfaces/controllers/admin/IAdmin.Tag.Controller';
import { IAdminTagService } from '../../core/interfaces/services/admin/IAdmin.Tag.Service';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminTagController implements IAdminTagController {
  constructor(
    @inject(TYPES.AdminTagService) private tagService: IAdminTagService
  ) {}

  async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const search = typeof req.query.search === "string" ? req.query.search : "";
      const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;
      const limit = 8;

      if (isNaN(page) || page < 1) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_PAGE_NUMBER });
        return;
      }

      const skip = (page - 1) * limit;
      const result = await this.tagService.getAllTags(skip, limit, search);

      if (!result) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_TAGS_FOUND });
        return;
      }

      const [tags, totalTags] = result;
      const totalPages = Math.ceil(totalTags / limit);

      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.TAGS_FETCHED,
        tags,
        pagination: {
          totalItems: totalTags,
          currentPage: page,
          totalPages,
          perPage: limit,
        },
      });
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.TAG_NAME_REQUIRED });
        return;
      }
      const tag = await this.tagService.createTag(name);
      res.status(STATUS_CODES.CREATED).json({ tag });
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  async editTagName(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name || typeof name !== 'string') {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.TAG_ID_NAME_REQUIRED });
        return;
      }
      const tag = await this.tagService.editTagName(id, name);
      if (!tag) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.TAG_NOT_FOUND });
        return;
      }
      res.status(STATUS_CODES.OK).json({ tag });
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  async listTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.TAG_ID_REQUIRED });
        return;
      }
      const tag = await this.tagService.listTag(id);
      if (!tag) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TAG_NOT_FOUND });
        return;
      }
      res.status(STATUS_CODES.OK).json({ tag });
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  async unlistTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.TAG_ID_REQUIRED });
        return;
      }
      const tag = await this.tagService.unlistTag(id);
      if (!tag) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TAG_NOT_FOUND });
        return;
      }
      res.status(STATUS_CODES.OK).json({ tag });
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}