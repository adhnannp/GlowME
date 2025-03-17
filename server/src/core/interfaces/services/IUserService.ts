import { IUser } from '../../../models/User';

export interface IUserService {
  register(user: IUser): Promise<string>;
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string }| string>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }>;
  resendOTP(email: string): Promise<string>;
}