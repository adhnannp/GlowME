import { Request, Response } from 'express';

export interface IUserConnectionController {
  followUser(req: Request, res: Response): Promise<void>;
  unfollowUser(req: Request, res: Response): Promise<void>;
  reportUser(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
}