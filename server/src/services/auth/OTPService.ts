import { injectable, inject } from 'inversify';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import { redisClient } from "../../config/redis";
import { generateOTP, sendOTPEmail } from '../../utils/otp';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';

@injectable()
export class OTPService implements IOTPService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  generateOTP(): string {
    return generateOTP();
  }

  async sendOTP(user: IUser, otp: string): Promise<void> {
    sendOTPEmail(user.email, otp);
    const userData = JSON.stringify({ user,otp });
    await redisClient.set(user.email, userData, { EX: 300 });
  }

  async resendOTP(email: string): Promise<void> {
    const storedData = await redisClient.get(email);
    if (!storedData) {
      throw new Error("User data expired or does not exist in Redis.");
    }
    const userData = JSON.parse(storedData);
    const newOTP = this.generateOTP();
    sendOTPEmail(email, newOTP);
    userData.otp = newOTP;
    await redisClient.set(email, JSON.stringify(userData), { EX: 300 });
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const storedData = await redisClient.get(email);
      if (!storedData) {
        throw new Error("User data expired or does not exist in Redis.");
      }
      const {otp:storedOTP} = JSON.parse(storedData);
      return storedOTP === otp;
    } catch (err) {
      console.error('Error verifying OTP:', err);
      throw err;
    }
  }
}