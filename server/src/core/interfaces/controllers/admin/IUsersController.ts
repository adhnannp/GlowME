import { Request, Response } from 'express';

export interface IUsersController {
  getAllUsers(req: Request, res: Response): Promise<void>;
}