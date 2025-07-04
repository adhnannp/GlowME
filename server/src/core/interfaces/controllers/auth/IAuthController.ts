import { Request, Response } from 'express';

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  loginUser(req: Request, res: Response): Promise<void>;
  loginAdmin(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  verifyUser(req: Request, res: Response): Promise<void>;
}
