import { inject, injectable } from 'inversify';
import { IUserService} from '../../core/interfaces/services/IUserService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
    ) {}

    async getUserByEmail(email: string): Promise<IUser> {
        const user = await this.userRepository.findUserById(email);
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        return user;
    }

}