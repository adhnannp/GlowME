import { inject, injectable } from 'inversify';
import { IAuthService} from '../../core/interfaces/services/IAuthService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';
import { IOTPService } from '../../core/interfaces/services/IOTPService';
import { signJWT, signRefreshToken,verifyRefreshToken  } from '../../utils/token';
import { redisClient } from "../../config/redis";
import { TYPES } from '../../di/types';
import { comparePassword } from '../../validators/comparePasswrod';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OTPService) private otpService: IOTPService
  ) {}

  async register(user: IUser): Promise<string> {
    const existingUser = await this.userRepository.findUserByEmail(user.email);
    if (existingUser) throw new Error('User already exists');

    const otp = this.otpService.generateOTP();
    await this.otpService.sendOTP(user,otp);

    return user.email;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !user.password) {
      throw new Error("invalid credential.");
    }
    const validPass = await comparePassword(password, user.password);
    if(!validPass){
      throw new Error("incorrect password")
    }
    const accessToken = signJWT({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id });
    return { accessToken, refreshToken };
  }

  async resendOTP(email: string): Promise<string> {
    await this.otpService.resendOTP(email);
    return "OTP has been resent.";
  }

  async verifyOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string } | string> {
    const isVerified = await this.otpService.verifyOTP(email, otp);
    if(!isVerified){
      throw new Error("not verified");
    }
    const storedData = await redisClient.get(email);
    if (!storedData) {
      throw new Error("User data expired or does not exist in Redis.");
    }
    const {user} = JSON.parse(storedData);
    const savedUser = await this.userRepository.createUser(user);
    const accessToken = signJWT({ userId: savedUser._id });
    const refreshToken = signRefreshToken({ userId: savedUser._id });
    await redisClient.del(email);
    return {accessToken,refreshToken}
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');
    const user = await this.userRepository.findUserById(payload.userId);
    if (!user) throw new Error('User not found');
    const accessToken = signJWT({ userId: user.id });
    const newRefreshToken = signRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyUser(userId:string): Promise<Omit<IUser, "password"> |null>{
    const userData = await this.userRepository.findUserById(userId)
    if(!userData) throw new Error("Invalid User Id");
    return userData;
  }
}