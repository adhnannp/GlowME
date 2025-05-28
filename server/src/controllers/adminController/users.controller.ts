import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { IUsersController } from '../../core/interfaces/controllers/admin/IUsersController';
import { TYPES } from '../../di/types';

@injectable()
export class UsersController implements IUsersController {
  constructor(
    @inject(TYPES.UsersService) private usersService: IUsersService
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
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
      const result = await this.usersService.getUser(skip, limit, search);

      if (!result) {
        res.status(404).json({ message: "No users found"});
        return;
      }

      const [users, totalUsers] = result;
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        message: "Users fetched successfully",
        users,
        pagination: {
          totalItems: totalUsers,
          currentPage: page,
          totalPages,
          perPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { duration } = req.body;
  
      if (!userId || !duration) {
        res.status(400).json({ message: 'User ID and duration are required' });
        return;
      }
  
      const user = await this.usersService.banUser(userId, duration);
      res.status(200).json({
        message: 'User banned successfully',
        user,
      });
      return
    } catch (error) {
      res.status(400).json({ message:error });
      return
    }
  }

  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
  
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
  
      const user = await this.usersService.unbanUser(userId);
  
      res.status(200).json({ message: 'User unbanned successfully', user });
      return
    } catch (error) {
      res.status(400).json({ message:error });
      return
    }
  }
  
}
