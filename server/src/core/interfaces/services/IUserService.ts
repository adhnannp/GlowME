import { IUser } from '../../../models/User';

export interface IUserService {
    getUserByEmail(email:string): Promise<IUser>;
}