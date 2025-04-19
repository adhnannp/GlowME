import { injectable } from 'inversify';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUser, UserModel } from '../models/User';
import { SafeUser } from '../core/types/SafeUser';
import bcrypt from 'bcrypt';

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async createGoogleUser(user:Partial<IUser>):Promise<IUser>{
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser| null> {
    return await UserModel.findOne({ email }).populate('currentBadge');
  }

  async findUserById(id: string): Promise<Omit<IUser, "password"> |null> {
      return await UserModel.findById(id).populate('currentBadge').select("-password");
  }

  async getAllUser(skip:number=0,limit:number=8): Promise<SafeUser[]| null >{
      return await UserModel.find({isAdmin:false},'-password').skip(skip).limit(limit).lean()
  }

  async getAllUsersWithFilter(
    skip: number = 0,
    limit: number = 8,
    filter: any = {}
  ): Promise<SafeUser[] | null> {
    return await UserModel.find({
      isAdmin: false,
      ...filter,      
    }, '-password')
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async totalUser(): Promise<number>{
    return await UserModel.countDocuments({isAdmin:false});
  }

  async totalUsersWithFilter(filter: any = {}): Promise<number> {
    return await UserModel.countDocuments({
      isAdmin: false,
      ...filter,
    });
  }

  async banUser(userId: string, banExpiresAt?: Date | null): Promise<SafeUser | null> {
    const updateData: Partial<IUser> = { isBlock: true };
    if (banExpiresAt) {
      updateData.ban_expires_at = banExpiresAt;
    } else {
      updateData.ban_expires_at = null;
    }

    return await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,select: '-password',}).lean();

  }

  async unbanUser(userId: string): Promise<SafeUser | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        isBlock: false,
        ban_expires_at: null,
      },
      {
        new: true, 
        select: '-password',
      }
    ).lean();
  }

  async unbanExpiredUsers(): Promise<boolean> {
    const now = new Date();
    const result = await UserModel.updateMany(
      {
        isBlock: true,
        ban_expires_at: {
          $lt: now,
        },
      },
      {
        $set: {
          isBlock: false,
          ban_expires_at: null,
        },
      }
    );
    console.log(result)
    return result.acknowledged === true;
  }
  
  async updateUserPassword(userId: string, password: string): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).populate('currentBadge');
    return user;
  }

}