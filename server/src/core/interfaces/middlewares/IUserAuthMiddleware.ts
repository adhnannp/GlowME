import { Request, Response, NextFunction } from 'express';

export interface IUserAuthMiddleware {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}