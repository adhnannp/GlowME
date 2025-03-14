import { UserRepository } from '../repositories/userRepository';
import { redisClient } from '../config/redis';
import { generateOTP, sendOTPEmail } from '../utils/otp';
import { signJWT, signRefreshToken } from '../utils/token';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(email: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) throw new Error('User already exists');

    const otp = generateOTP();
    await redisClient.set(email, otp, { EX: 300 });
    await sendOTPEmail(email, otp);

    await this.userRepository.createUser({ email, password });
  }

  async verifyOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedOTP = await redisClient.get(email);
    if (storedOTP !== otp) throw new Error('Invalid OTP');

    const user = await this.userRepository.verifyUser(email);
    if (!user) throw new Error('User not found');

    const accessToken = signJWT({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id });

    return { accessToken, refreshToken };
  }
}