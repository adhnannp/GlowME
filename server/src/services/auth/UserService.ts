import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import { signJWT, signRefreshToken,verifyRefreshToken } from '../../utils/token';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IOTPService') private otpService: IOTPService,
  ) {}

  async register(user: IUser): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(user.email);
    if (existingUser) throw new Error('User already exists');
    const otp = this.otpService.generateOTP();
    await this.otpService.sendOTP(user.email, otp);
    return await this.userRepository.createUser(user);
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    const accessToken = signJWT({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    return { accessToken, refreshToken };
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    return await this.otpService.verifyOTP(email, otp);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');
    const user = await this.userRepository.findUserById(payload.userId);
    if (!user) throw new Error('User not found');
    const accessToken = signJWT({ userId: user.id });
    const newRefreshToken = signRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

}