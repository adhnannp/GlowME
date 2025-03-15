// src/services/OTPService.ts
import { injectable } from 'inversify';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import nodemailer from 'nodemailer';
import redis from 'redis';
import { generateOTP, sendOTPEmail } from '../../utils/otp';

@injectable()
export class OTPService implements IOTPService {
  private redisClient = redis.createClient();

  generateOTP(): string {
    return generateOTP()
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    sendOTPEmail(email,otp)
    this.redisClient.set(email, otp, {EX:300});
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const storedOTP = await this.redisClient.get(email);
      return storedOTP === otp;
    } catch (err) {
      console.error('Error verifying OTP:', err);
      throw err;
    }
  }
}