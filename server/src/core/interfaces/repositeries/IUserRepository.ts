import { IUser } from '../../../models/User';

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser| null>;
  findUserById(id: string): Promise<IUser| null>;
}