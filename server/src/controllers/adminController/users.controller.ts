import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { IUsersController } from '../../core/interfaces/controllers/admin/IUsersController';
import { TYPES } from '../../di/types';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

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
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_PAGE_NUMBER });
        return;
      }

      const skip = (page - 1) * limit;
      const result = await this.usersService.getUser(skip, limit, search);

      if (!result) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_USERS_FOUND});
        return;
      }

      const [users, totalUsers] = result;
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.USERS_FETCHED,
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
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { duration } = req.body;
  
      if (!userId || !duration) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.BAN_USER_ID_DURATION_RRQUIRED });
        return;
      }
  
      const user = await this.usersService.banUser(userId, duration);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.BAN_SUCCESS,
        user,
      });
      return
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({ message:err.message });
      return
    }
  }

  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
  
      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_ID_REQUIRED });
        return;
      }
  
      const user = await this.usersService.unbanUser(userId);
  
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.UNBAN_SUCCESS, user });
      return
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message:error });
      return
    }
  }
  
}
