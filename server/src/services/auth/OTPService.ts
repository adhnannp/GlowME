// src/services/OTPService.ts
import { injectable } from 'inversify';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import { redisClient } from "../../config/redis"
import { generateOTP, sendOTPEmail } from '../../utils/otp';

@injectable()
export class OTPService implements IOTPService {
  constructor() {
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  }
  generateOTP(): string {
    return generateOTP()
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    sendOTPEmail(email,otp)
    await redisClient.set(email, otp, {EX:300});
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const storedOTP = await redisClient.get(email);
      return storedOTP === otp;
    } catch (err) {
      console.error('Error verifying OTP:', err);
      throw err;
    }
  }
}