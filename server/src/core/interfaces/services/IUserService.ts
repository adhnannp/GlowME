import { IUser } from '../../../models/User';

export interface IUserService {
  register(user: IUser): Promise<IUser>;
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }>
}