import { Request, Response, NextFunction } from 'express';

export interface IAdminAuthMiddleware {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}