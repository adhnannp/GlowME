import { Request, Response, NextFunction } from 'express';

export interface IGoogleAuthController {
  handleGoogleCallback(req: Request, res: Response, next: NextFunction): Promise<void>;
}
