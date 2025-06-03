import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IForgotPasswordService } from '../../core/interfaces/services/auth/IForgotPasswordService';
import { TYPES } from '../../di/types';
import { IForgotPasswordcontroller } from '../../core/interfaces/controllers/auth/IforgotPasswordController';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class ForgotPasswordcontroller implements IForgotPasswordcontroller{
  constructor(
    @inject(TYPES.ForgotPasswordService) private forgotPasswordService: IForgotPasswordService
  ) {}

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.FORGOT_PASSWORD_EMAIL_REQUIRED });
        return;
      }
      await this.forgotPasswordService.requestPasswordReset(email);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.FORGOT_PASSWORD_SUCCESS });
    } catch (err) {
      const error = err as Error
      console.error('Error in forgotPassword:', error);
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message});
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.RESET_PASSWORD_REQUIRED_FIELDS });
        return;
      }
      await this.forgotPasswordService.resetPassword(token, password);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.RESET_PASSWORD_SUCCESS });
    } catch (err) {
      const error = err as Error
      console.error('Error in resetPassword:', error);
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
  }
}