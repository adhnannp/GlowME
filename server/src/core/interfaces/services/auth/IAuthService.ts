import { IUser } from '../../../../models/User';

export interface IAuthService {
  register(user: IUser): Promise<string>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }|string>;
  loginAdmin(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }|string>;
  verifyOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string }| string>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  resendOTP(email: string): Promise<string>;
  verifyUser(userId:string):Promise<Omit<IUser, "password"> |null>;
}