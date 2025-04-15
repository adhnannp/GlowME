import { Request, Response } from 'express';

export interface IUsersController {
  getAllUsers(req: Request, res: Response): Promise<void>;
  banUser(req: Request, res: Response): Promise<void>;
  unbanUser(req: Request, res: Response): Promise<void>;
}