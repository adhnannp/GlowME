import { injectable } from 'inversify';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUser, UserModel } from '../models/User';
import { SafeUser } from '../core/types/SafeUser';

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
    const today = new Date();
    const lowerBound = new Date(today);
    lowerBound.setHours(23, 59, 0, 0);
    const upperBound = new Date(today);
    upperBound.setDate(upperBound.getDate() + 1);
    upperBound.setHours(0, 1, 0, 0); 
    const result = await UserModel.updateMany(
      {
        isBlock: true,
        ban_expires_at: {
          $gte: lowerBound,
          $lt: upperBound,
        },
      },
      {
        $set: {
          isBlock: false,
          ban_expires_at: null,
        },
      }
    );
    return result.acknowledged === true;
  }
  
}