import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../di/types';
import { IAdminTagController } from '../../core/interfaces/controllers/admin/IAdmin.Tag.Controller';
import { IAdminTagService } from '../../core/interfaces/services/admin/IAdmin.Tag.Service';

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
        res.status(400).json({ message: "Invalid page number" });
        return;
      }

      const skip = (page - 1) * limit;
      const result = await this.tagService.getAllTags(skip, limit, search);

      if (!result) {
        res.status(404).json({ message: "No tags found" });
        return;
      }

      const [tags, totalTags] = result;
      const totalPages = Math.ceil(totalTags / limit);

      res.status(200).json({
        message: "Tags fetched successfully",
        tags,
        pagination: {
          totalItems: totalTags,
          currentPage: page,
          totalPages,
          perPage: limit,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'Tag name is required and must be a string' });
        return;
      }
      const tag = await this.tagService.createTag(name);
      res.status(201).json({ tag });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async editTagName(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name || typeof name !== 'string') {
        res.status(400).json({ message: 'Tag ID and name are required' });
        return;
      }
      const tag = await this.tagService.editTagName(id, name);
      if (!tag) {
        res.status(400).json({ message: 'Tag not found' });
        return;
      }
      res.status(200).json({ tag });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async listTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Tag ID is required' });
        return;
      }
      const tag = await this.tagService.listTag(id);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      res.status(200).json({ tag });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async unlistTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Tag ID is required' });
        return;
      }
      const tag = await this.tagService.unlistTag(id);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      res.status(200).json({ tag });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}