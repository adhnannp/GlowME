// src/services/OTPService.ts
import { injectable } from 'inversify';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import nodemailer from 'nodemailer';
import redis from 'redis';

@injectable()
export class OTPService implements IOTPService {
  private redisClient = redis.createClient();

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}`,
    });

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