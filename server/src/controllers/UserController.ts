import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../core/interfaces/services/IUserService';

@injectable()
export class UserController {
  constructor(@inject('IUserService') private userService: IUserService) {}

  async register(req: Request, res: Response) {
    const user = req.body;
    const newUser = await this.userService.register(user);
    res.status(201).json(newUser);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.userService.login(email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
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

  async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const isValid = await this.userService.verifyOTP(email, otp);
    res.status(200).json({ isValid });
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
      const newAccessToken = await this.userService.refreshToken(refreshToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

}