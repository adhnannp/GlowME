import { inject, injectable } from 'inversify';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { TYPES } from '../../di/types';
import { SafeUser } from '../../core/types/SafeUser';

@injectable()
export default class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {}

    async getUser(skip:number,limit:number): Promise<[SafeUser[],number] | null>{
        if(skip<0) {
            return null;
        } 
        const users = await this.userRepository.getAllUser(skip,limit);
        const TotalUsers = await this.userRepository.totalUser()
        if(!users)return null;
        return [users,TotalUsers];
    }
}