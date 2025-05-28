import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserTagService } from "../../core/interfaces/services/user/IUser.Tag.Service";
import { IUserTagController } from "../../core/interfaces/controllers/user/IUser.Tag.Controller";

@injectable()
export class UserTagController implements IUserTagController {
  constructor(
    @inject(TYPES.UserTagService) private userTagService: IUserTagService
  ) {}

  async searchTag(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.query as string)?.trim();
      if (!query) {
        res
          .status(400)
          .json({ message: "no Query provided" });
        return;
      }
      const tags = await this.userTagService.searchTags(query);
      res.status(200).json({tags});
    } catch (error) {
      const err = error as Error  
      res.status(400).json({ message: err.message });
      return
    }
  }
}
