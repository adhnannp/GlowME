import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IGoogleAuthController } from '../../core/interfaces/controllers/auth/IGoogleAuthController';
import { IGoogleAuthService } from '../../core/interfaces/services/auth/IGoogleAuthService';
import { TYPES } from '../../di/types';
import { setRefreshTokens } from '../../utils/setRefreshToken';
import dotenv from 'dotenv';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

dotenv.config();

@injectable()
export class GoogleAuthController implements IGoogleAuthController {
  constructor(
    @inject(TYPES.GoogleAuthService) private googleAuthService: IGoogleAuthService
  ) {}

  async handleGoogleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = req.user as any;
      if(!profile){
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.AUTH_FAILED });
        return;
      }
      const result = await this.googleAuthService.validateOrCreateUser(profile);
      if (!result) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.GOOGLE_INVALID });
        return;
      }
      const { user, accessToken, refreshToken } = result;
      if (user.isAdmin) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ACCESS_DENIED });
        return;
      }
      setRefreshTokens(res,refreshToken);
      if (user.isAdmin) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ACCESS_DENIED });
        return;
      }
      setRefreshTokens(res, refreshToken);
      
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage(
                ${JSON.stringify({ token: accessToken })},
                '${process.env.CLIENT_URL!}'
              );
              window.close();
            </script>
          </body>
        </html>
      `);      
    } catch (err) {
      const error = err as Error;
      next(error.message);
    }
  }
}
