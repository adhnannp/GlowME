import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IForgotPasswordService } from '../../core/interfaces/services/auth/IForgotPasswordService';
import { TYPES } from '../../di/types';
import { IForgotPasswordcontroller } from '../../core/interfaces/controllers/auth/IforgotPasswordController';

@injectable()
export class ForgotPasswordcontroller implements IForgotPasswordcontroller{
  constructor(
    @inject(TYPES.ForgotPasswordService) private forgotPasswordService: IForgotPasswordService
  ) {}

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Valid email is required' });
        return;
      }
      await this.forgotPasswordService.requestPasswordReset(email);
      res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (err) {
      const error = err as Error
      console.error('Error in forgotPassword:', error);
      res.status(400).json({ message: error.message});
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
        res.status(400).json({ message: 'Token and password are required' });
        return;
      }
      await this.forgotPasswordService.resetPassword(token, password);
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      const error = err as Error
      console.error('Error in resetPassword:', error);
      res.status(400).json({ message: error.message || 'Invalid or expired token' });
    }
  }
}