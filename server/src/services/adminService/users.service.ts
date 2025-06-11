import { inject, injectable } from 'inversify';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { TYPES } from '../../di/types';
import { SafeUser } from '../../core/types/SafeUser';
import { addDays, addWeeks, addMonths, addYears, startOfDay } from 'date-fns';

@injectable()
export default class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {}

    async getUser(skip:number,limit:number,search:string=''): Promise<[SafeUser[],number] | null>{
        if(skip<0) {
            return null;
        } 
        const users = await this.userRepository.getAllUser(skip,limit,search);
        const totalUsers = await this.userRepository.totalUser(search);
        if(!users)return [[],totalUsers];
        return [users,totalUsers];
    }

    async banUser(userId: string, banDuration: string): Promise<SafeUser | null> {
        let banExpiresAt: Date | null = null;
    
        const currentTime = new Date();
    
        switch (banDuration) {
            case 'one_day':
                banExpiresAt = startOfDay(addDays(currentTime, 1));
                break;
            case 'one_week':
                banExpiresAt = startOfDay(addWeeks(currentTime, 1));
                break;
            case 'one_month':
                banExpiresAt = startOfDay(addMonths(currentTime, 1));
                break;
            case 'one_year':
                banExpiresAt = startOfDay(addYears(currentTime, 1));
                break;
            case 'permanent':
                banExpiresAt = null;
                break;
            default:
                throw new Error('Invalid ban duration');
        }
    
        return await this.userRepository.banUser(userId, banExpiresAt);
    }
    
    async unbanUser(userId: string): Promise<SafeUser | null> {
        return await this.userRepository.unbanUser(userId);
    }
}