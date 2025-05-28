import { IUser } from '../../../models/User';
import { SafeUser } from '../../types/SafeUser';

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  createGoogleUser(user:Partial<IUser>):Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser| null>;
  findUserById(id: string): Promise<Omit<IUser, "password"> |null>;
  getAllUser(skip:number,limit:number,search?: string): Promise<SafeUser[] | null>;
  getAllUsersWithFilter(skip: number,limit: number,filter: any): Promise<SafeUser[] | null> 
  totalUser(search?:string): Promise<number>;
  totalUsersWithFilter(filter?: any): Promise<number>;
  banUser(userId: string, banExpiresAt?: Date | null): Promise<SafeUser | null>;
  unbanUser(userId: string): Promise<SafeUser | null>;
  unbanExpiredUsers(): Promise<boolean> ;
  updateUserPassword(userId: string, password: string): Promise<IUser | null>;
  updateUserProfile(userId: string, data: { username: string; profile_image?: string }): Promise<SafeUser | null>;
  incrementCoin(userId: string, coins: number): Promise<SafeUser>;
  incrementXp(userId: string, xp: number): Promise<void>;
}