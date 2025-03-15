import { IUser } from '../../../models/User';

export interface IUserService {
  register(user: IUser): Promise<IUser>;
  login(email: string, password: string): Promise<string>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
}