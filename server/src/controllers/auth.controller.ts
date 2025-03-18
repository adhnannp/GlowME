import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '../core/interfaces/services/IAuthService';

@injectable()
export class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    const user = req.body;
    const newUser = await this.authService.register(user);
    res.status(201).json({message:newUser});
  }

  async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const isValid = await this.authService.verifyOTP(email, otp);
    res.status(200).json({ isValid });
  }
  
  async resendOTP(req: Request, res: Response){
    const {email} = req.body
    await this.authService.resendOTP(email)
    res.status(200).json({message:'OTP resend successfully'});
  }
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.login(email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful' });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return
    }
    try {
      const newAccessToken = await this.authService.refreshToken(refreshToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

}