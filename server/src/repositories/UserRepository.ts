import { injectable } from 'inversify';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IUser, UserModel } from '../models/User';

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser| null> {
    return await UserModel.findOne({ email });
  }

  async findUserById(id: string): Promise<IUser| null> {
      return await UserModel.findById(id).select("-password");
  }
}