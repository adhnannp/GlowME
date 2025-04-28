import { IUser } from '../../../../models/User';
import { SafeUser } from '../../../types/SafeUser';

export interface IUserService {
    getUserByEmail(email:string): Promise<Partial<IUser>| null>;
    changePassword(userId: string, oldPassword: string | undefined, newPassword: string, googleUser: boolean): Promise<SafeUser | null>;
    hasPassword(userId:string):Promise<boolean>;
}