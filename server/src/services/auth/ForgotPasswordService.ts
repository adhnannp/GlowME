import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { TYPES } from '../../di/types';
import { redisClient } from '../../config/redis';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendResetEmail } from '../../utils/otp';
import { IForgotPasswordService } from '../../core/interfaces/services/auth/IForgotPasswordService';

@injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !user._id || user.isBlock || user.isAdmin) {
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const ttlSeconds = 600; 

    await redisClient.set(
      `reset:${hashedToken}`,
      user._id.toString(),
      { EX: ttlSeconds }
    );
    
    const resetLink = `http://localhost:4000/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {

    const keys = await redisClient.keys('reset:*');
    let userId: string | null = null;

    for (const key of keys) {
      const storedHash = key.replace('reset:', '');
      const isValid = await bcrypt.compare(token, storedHash);
      if (isValid) {
        userId = await redisClient.get(key);
        break;
      }
    }

    if (!userId) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.updateUserPassword(userId, newPassword);
    if (!user) {
      throw new Error('User not found');
    }

    const userTokens = await redisClient.keys('reset:*');
    for (const key of userTokens) {
      if ((await redisClient.get(key)) === userId) {
        await redisClient.del(key);
      }
    }
  }
}