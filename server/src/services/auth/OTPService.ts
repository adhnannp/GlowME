import { injectable, inject } from 'inversify';
import { IOTPService } from '../../core/interfaces/services/auth/IOTPService';
import { redisClient } from '../../config/redis';
import { generateOTP, sendOTPEmail } from '../../utils/otp';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';

@injectable()
export class OTPService implements IOTPService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
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
      throw new Error('User data expired or does not exist in Redis.');
    }
    const ttl = await redisClient.ttl(email);
    if(!ttl || ttl<=50){
      throw new Error('Resent OTP limit exceeds');
    }
    const userData = JSON.parse(storedData);
    const newOTP = this.generateOTP();
    sendOTPEmail(email, newOTP);
    userData.otp = newOTP;
    await redisClient.set(email, JSON.stringify(userData), { EX: ttl });
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const storedData = await redisClient.get(email);
      if (!storedData) {
        throw new Error('User data expired or does not exist in Redis.');
      }
      const {otp:storedOTP} = JSON.parse(storedData);
      return storedOTP === otp;
    } catch (err) {
      console.error('Error verifying OTP:', err);
      throw err;
    }
  }
}