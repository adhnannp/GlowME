// src/controllers/UserConnectionController.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserConnectionService } from '../../core/interfaces/services/user/IUserConnectionService';
import { TYPES } from '../../di/types';
import { IUserConnectionController } from '../../core/interfaces/controllers/user/IUserConnectionController';
import { IConnection } from '../../models/Connection';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class UserConnectionController implements IUserConnectionController {
  constructor(
    @inject(TYPES.UserConnectionService) private userConnectionService: IUserConnectionService
  ) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { followingId } = req.body;
      if (!userId || !followingId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      const result = await this.userConnectionService.followUser(userId, followingId);
      res.status(STATUS_CODES.OK).json({ result, message: MESSAGES.FOLLOWED_SUCCESS });
      return;
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json(error);
      return;
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { followingId } = req.body;
      if (!userId || !followingId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      await this.userConnectionService.unfollowUser(userId, followingId);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.UNFOLLOWED_SUCCESS });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json(error);
    }
  }

  async reportUser(req: Request, res: Response): Promise<void> {
    try {
      const reporterId = req.userId;
      const { userId, reason } = req.body; 
      if (!reporterId || !userId || !reason) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      const result = await this.userConnectionService.reportUser(reporterId, userId, reason);
      res.status(STATUS_CODES.OK).json(result);
      return;
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({message:error.message});
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const search = typeof req.query.search === 'string' ? req.query.search : '';
      if(!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
        return;
      } 
      const pageParam = req.query.page;
      const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
      const limit = 12;
      if (isNaN(page) || page < 1) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_PAGE_NUMBER });
        return;
      }
      const skip = (page - 1) * limit;
      const result = await this.userConnectionService.getUsers(skip, limit,search);
      if (!result) {
        res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.NO_USERS_FOUND });
        return;
      }
      const [users, total] = result;
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.USERS_FETCHED,
        users,
        total,
        skip,
        page,
      });
      return;
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json(error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUserId = req.userId!;
      if(!currentUserId || !id){
        res.status(STATUS_CODES.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
      }
      const result = await this.userConnectionService.findUserById(id,currentUserId);
      if (!result) {
        res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
        return;
      }
      const [user, followerCount,followingCount,isFollowing] = result;
      res.status(STATUS_CODES.OK).json({
        user,
        followerCount,
        followingCount,
        isFollowing,
      });
    } catch (err) {
      const error = err as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      if(!userId){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      const followers: IConnection[] | null = await this.userConnectionService.getFollowers(userId);
      
      if (!followers) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.FOLLOWERS_NOT_FOUND });
        return;
      }

      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.FOLLOWERS_RETRIEVED,
        data: followers,
      });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: `${MESSAGES.ERROR_FETCHING_FOLLOWERS}: ${(error as Error).message}` });
    }
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const userId  = req.userId!;
      if(!userId){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      const following: IConnection[] | null = await this.userConnectionService.getFollowing(userId);
      
      if (!following) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.FOLLOWING_NOT_FOUND });
        return;
      }

      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.FOLLOWING_USERS_RETRIEVED,
        data: following,
      });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: `${MESSAGES.ERROR_FETCHING_FOLLOWING}: ${(error as Error).message}` });
    }
  }
}