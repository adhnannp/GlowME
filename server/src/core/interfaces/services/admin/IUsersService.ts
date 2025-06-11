import { SafeUser } from '../../../types/SafeUser';

export interface IUsersService {
    getUser(skip:number,limit:number,search?:string): Promise<[SafeUser[],number] | null>;
    banUser(userId: string, banDuration: string): Promise<SafeUser | null>;
    unbanUser(userId: string): Promise<SafeUser | null>;
}