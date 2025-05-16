import { injectable } from 'inversify';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUser, UserModel } from '../models/User';
import { SafeUser } from '../core/types/SafeUser';
import bcrypt from 'bcrypt';
import { passwordSchema, usernameSchema } from '../validators/userDataValidation';

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
      return await UserModel.find({isAdmin:false},'-password')
      .populate({
        path: 'currentBadge',
        select: 'name image requiredXp',
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
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
      .populate({
        path: 'currentBadge',
        select: 'name image requiredXp',
      })
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
    const validationResult = passwordSchema.safeParse(password);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).populate('currentBadge');
    return user;
  }

  async updateUserProfile(userId: string, data: { username: string; profile_image?: string }): Promise<SafeUser | null> {
    const validationResult = usernameSchema.safeParse(data.username);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    const updateData: { username: string; profile_image?: string; } = {
      username: data.username,
    };
    if (data.profile_image) {
      updateData.profile_image = data.profile_image;
    }
    return UserModel.findByIdAndUpdate(userId, updateData, { new: true }).populate("currentBadge").select("-password");
  }

  async incrementCoin(userId: string, coins: number): Promise<SafeUser> {
    return await UserModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { coin_balance: coins } },
      { new: true }
    ).populate("currentBadge").select("-password");
  }

  async incrementXp(userId: string, xp: number): Promise<void> {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { xp } },
      { new: true }
    ).populate("currentBadge").select("-password");
  }

}