import { injectable } from 'inversify';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IUser, UserModel } from '../models/User';
import { SafeUser } from '../core/tpes/SafeUser';

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser| null> {
    return await UserModel.findOne({ email });
  }

  async findUserById(id: string): Promise<Omit<IUser, "password"> |null> {
      return await UserModel.findById(id).select("-password");
  }

  async getAllUser(skip:number=0): Promise<SafeUser[]| null >{
      return await UserModel.find({isAdmin:false},'-password').skip(skip).limit(8).lean()
  }

  async totalUser(): Promise<number>{
    return await UserModel.countDocuments({isAdmin:false});
  }

}