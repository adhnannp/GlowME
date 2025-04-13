import { IUser } from '../../../models/User';
import { SafeUser } from '../../types/SafeUser';

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  createGoogleUser(user:Partial<IUser>):Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser| null>;
  findUserById(id: string): Promise<Omit<IUser, "password"> |null>;
  getAllUser(skip:number,limit:number): Promise<SafeUser[] | null>;
  getAllUsersWithFilter(skip: number,limit: number,filter: any): Promise<SafeUser[] | null> 
  totalUser(): Promise<number>;
  totalUsersWithFilter(filter?: any): Promise<number>;
}