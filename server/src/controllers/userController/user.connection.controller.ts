// src/controllers/UserConnectionController.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserConnectionService } from '../../core/interfaces/services/user/IUserConnectionService';
import { TYPES } from '../../di/types';
import { IUserConnectionController } from '../../core/interfaces/controllers/user/IUserConnectionController';
import { IConnection } from '../../models/Connection';

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
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const result = await this.userConnectionService.followUser(userId, followingId);
      res.status(200).json({ result, message: "Followed successfully" });
      return;
    } catch (error) {
      res.status(400).json(error);
      return;
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { followingId } = req.body;
      if (!userId || !followingId) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      await this.userConnectionService.unfollowUser(userId, followingId);
      res.status(200).json({ message: "Successfully unfollowed" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async reportUser(req: Request, res: Response): Promise<void> {
    try {
      const reporterId = req.userId;
      const { userId, reason } = req.body; 
      if (!reporterId || !userId || !reason) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const result = await this.userConnectionService.reportUser(reporterId, userId, reason);
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId
      if(!userId) {
        res.status(404).json({ error: "Invalid credentails" });
        return
      } 
      const pageParam = req.query.page;
      const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
      const limit = 12;
      if (isNaN(page) || page < 1) {
        res.status(400).json({ message: 'Invalid page number' });
        return;
      }
      const skip = (page - 1) * limit;
      const result = await this.userConnectionService.getUsers(skip, limit,userId);
      if (!result) {
        res.status(404).json({ error: "No users found" });
        return;
      }
      const [users, total] = result;
      res.status(200).json({
        message: 'Users fetched successfully',
        users,
        total,
        skip,
        page,
      });
      return;
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUserId = req.userId!
      if(!currentUserId || !id){
        res.status(401).json({ error: "Invalid credential" });
      }
      const result = await this.userConnectionService.findUserById(id,currentUserId);
      if (!result) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const [user, followerCount,followingCount,isFollowing] = result;
      res.status(200).json({
        user,
        followerCount,
        followingCount,
        isFollowing,
      });
    } catch (err) {
      const error = err as Error
      res.status(400).json({ message: error.message });
    }
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      if(!userId){
        res.status(400).json({ message: 'No Credential provided' });
        return;
      }
      const followers: IConnection[] | null = await this.userConnectionService.getFollowers(userId);
      
      if (!followers) {
        res.status(400).json({ message: 'No followers found' });
        return;
      }

      res.status(200).json({
        message: 'Followers retrieved successfully',
        data: followers,
      });
    } catch (error) {
      res.status(400).json({ message: `Error fetching followers: ${(error as Error).message}` });
    }
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const userId  = req.userId!;
      if(!userId){
        res.status(400).json({ message: 'No Credential provided' });
        return
      }
      const following: IConnection[] | null = await this.userConnectionService.getFollowing(userId);
      
      if (!following) {
        res.status(400).json({ message: 'No following found' });
        return;
      }

      res.status(200).json({
        message: 'Following retrieved successfully',
        data: following,
      });
    } catch (error) {
      res.status(400).json({ message: `Error fetching following: ${(error as Error).message}` });
    }
  }
}