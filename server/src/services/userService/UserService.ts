import { inject, injectable } from 'inversify';
import { IUserService} from '../../core/interfaces/services/user/IUserService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    ) {}

    async getUserByEmail(email: string): Promise<Partial<IUser>| null> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        return userWithoutPassword;
    }

}