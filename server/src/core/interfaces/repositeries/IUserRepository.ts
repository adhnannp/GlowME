import { IUser } from '../../../models/User';
import { SafeUser } from '../../tpes/SafeUser';

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser| null>;
  findUserById(id: string): Promise<Omit<IUser, "password"> |null>;
  getAllUser(skip:number): Promise<SafeUser[] | null>;
  totalUser(): Promise<number>;
}