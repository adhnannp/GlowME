import { inject, injectable } from 'inversify';
import { IAuthService} from '../../core/interfaces/services/auth/IAuthService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { IOTPService } from '../../core/interfaces/services/auth/IOTPService';
import { signJWT, signRefreshToken,verifyRefreshToken  } from '../../utils/token';
import { redisClient } from '../../config/redis';
import { TYPES } from '../../di/types';
import { comparePassword } from '../../validators/comparePasswrod';
import { registerSchema } from '../../validators/userDataValidation';
import { IBadgeRepository } from '../../core/interfaces/repositories/IBadgeRepository';


@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.BadgeRepository) private badgeRepo: IBadgeRepository,
  ) {}

  async register(user: IUser): Promise<string> {
    const validatedUser = registerSchema.parse(user);
    const existingUser = await this.userRepository.findUserByEmail(user.email);
    if (existingUser) throw new Error('User already exists');

    const otp = this.otpService.generateOTP();
    await this.otpService.sendOTP(user,otp);

    return user.email;
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.isAdmin) {
      throw new Error('No User Found');
    }
    if (user.isBlock) {
      if (user.ban_expires_at) {
        const banExpires = new Date(user.ban_expires_at);
        throw new Error(`You are banned. Ban will expire at: ${banExpires.toLocaleString()}`);
      }
      throw new Error('You are banned Permenently');
    }
    if(!user.password ){
      throw new Error('Please Login With Google Or try Forgot Password');
    }
    const validPass = await comparePassword(password, user.password!);
    if(!validPass){
      throw new Error('incorrect password');
    }
    const accessToken = signJWT({ userId: user._id , isAdmin:user.isAdmin});
    const refreshToken = signRefreshToken({ userId: user._id, isAdmin:user.isAdmin });
    return { accessToken, refreshToken };
  }

  async loginAdmin(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !user.isAdmin) {
      throw new Error('No Admin Found');
    }
    const validPass = await comparePassword(password, user.password!);
    if(!validPass){
      throw new Error('incorrect password');
    }
    const accessToken = signJWT({ userId: user._id , isAdmin:user.isAdmin});
    const refreshToken = signRefreshToken({ userId: user._id, isAdmin:user.isAdmin });
    return { accessToken, refreshToken };
  }

  async resendOTP(email: string): Promise<string> {
    await this.otpService.resendOTP(email);
    return 'OTP has been resent.';
  }

  async verifyOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string } | string> {
    const isVerified = await this.otpService.verifyOTP(email, otp);
    if(!isVerified){
      throw new Error('not verified');
    }
    const storedData = await redisClient.get(email);
    if (!storedData) {
      throw new Error('User data expired or does not exist in Redis.');
    }
    const {user} = JSON.parse(storedData);
    const savedUser = await this.userRepository.createUser(user);
    const basicBadge = await this.badgeRepo.getBasicBadge();
    if (!savedUser?._id || !basicBadge?._id) {
      throw new Error("Saved user or basic badge is missing an ID.");
    }
    await this.badgeRepo.addBadgeToUser(savedUser._id.toString(),basicBadge._id.toString())
    const accessToken = signJWT({ userId: savedUser._id, isAdmin:user.isAdmin });
    const refreshToken = signRefreshToken({ userId: savedUser._id , isAdmin:user.isAdmin});
    await redisClient.del(email);
    return {accessToken,refreshToken};
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');
    const user = await this.userRepository.findUserById(payload.userId);
    if (!user) throw new Error('User not found');
    const accessToken = signJWT({ userId: user.id, isAdmin:user.isAdmin });
    const newRefreshToken = signRefreshToken({ userId: user.id , isAdmin:user.isAdmin});

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyUser(userId:string): Promise<Omit<IUser, 'password'> |null>{
    const userData = await this.userRepository.findUserById(userId);
    if(!userData) return null;
    return userData;
  }
}