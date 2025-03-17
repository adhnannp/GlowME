import { IUser } from '../../../models/User';

export interface IOTPService {
    generateOTP(): string;
    sendOTP(user: IUser, otp: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    resendOTP(email: string): Promise<void>;
  }