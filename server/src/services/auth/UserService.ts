import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';
import { IOTPService } from '../../core/interfaces/services/IOTPService';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IOTPService') private otpService: IOTPService,
  ) {}

  async register(user: IUser): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(user.email);
    if (existingUser) throw new Error('User already exists');
    const otp = this.otpService.generateOTP();
    await this.otpService.sendOTP(user.email, otp);
    return await this.userRepository.createUser(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    return 'Login successful';
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    return await this.otpService.verifyOTP(email, otp);
  }
}