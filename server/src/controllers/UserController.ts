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
    const token = await this.userService.login(email, password);
    res.status(200).json({ token });
  }

  async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const isValid = await this.userService.verifyOTP(email, otp);
    res.status(200).json({ isValid });
  }
}