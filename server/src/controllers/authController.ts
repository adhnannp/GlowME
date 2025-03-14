import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    await this.authService.register(email, password);
    res.status(201).json({ message: 'OTP sent to email' });
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    const tokens = await this.authService.verifyOTP(email, otp);
    res.status(200).json(tokens);
  }
}