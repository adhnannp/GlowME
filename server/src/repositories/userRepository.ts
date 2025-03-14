import { IUser } from '../models/User';
import User from '../models/User';

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async verifyUser(email: string): Promise<IUser | null> {
    return await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
  }
}