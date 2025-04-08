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
      const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
      const limit = 8;
      if (isNaN(page) || page < 1) {
        res.status(400).json({ message: 'Invalid page number' });
        return;
      }
      const skip = (page - 1) * limit;
      const result = await this.usersService.getUser(skip,limit);
  
      if (!result) {
        res.status(404).json({ message: 'No users found' });
        return;
      }
      const [users, totalUsers] = result;
      const totalPages = Math.ceil(totalUsers / limit);
      res.status(200).json({
        message: 'Users fetched successfully',
        users,
        page,
        totalUsers,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong', error });
    }
  }
  
}
