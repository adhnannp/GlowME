import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IGoogleAuthController } from '../../core/interfaces/controllers/auth/IGoogleAuthController';
import { IGoogleAuthService } from '../../core/interfaces/services/auth/IGoogleAuthService';
import { TYPES } from '../../di/types';
import { setRefreshTokens } from '../../utils/setRefreshToken';

@injectable()
export class GoogleAuthController implements IGoogleAuthController {
  constructor(
    @inject(TYPES.GoogleAuthService) private googleAuthService: IGoogleAuthService
  ) {}

  async handleGoogleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = req.user as any;
      if(!profile){
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }
      const result = await this.googleAuthService.validateOrCreateUser(profile);
      if (!result) {
        res.status(400).json({ message: 'Invalid Google account data' });
        return;
      }
      const { user, accessToken, refreshToken } = result;
      if (user.isAdmin) {
        res.status(400).json({ message: 'Access Denied' });
        return;
      }
      setRefreshTokens(res,refreshToken)
      if (user.isAdmin) {
        res.status(400).json({ message: 'Access Denied' });
        return;
      }
      setRefreshTokens(res, refreshToken);
      
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage(
                ${JSON.stringify({ token: accessToken })},
                'http://localhost:4000'
              );
              window.close();
            </script>
          </body>
        </html>
      `);      
    } catch (error:any) {
      next(error.message);
    }
  }
}
