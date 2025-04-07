import { inject, injectable } from 'inversify';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { TYPES } from '../../di/types';
import { SafeUser } from '../../core/tpes/SafeUser';

@injectable()
export default class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {}

    async getUser(skip:number): Promise<[SafeUser[],number] | null>{
        if(skip<0) {
            return null;
        } 
        const users = await this.userRepository.getAllUser(skip);
        const TotalUsers = await this.userRepository.totalUser()
        if(!users)return null;
        return [users,TotalUsers];
    }
}