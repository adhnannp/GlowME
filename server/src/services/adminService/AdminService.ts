import { inject, injectable } from 'inversify';
import { IAdminService } from '../../core/interfaces/services/IAdminService';
import { IUserRepository } from '../../core/interfaces/repositeries/IUserRepository';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    ) {}

    async getAdminByEmail(email: string): Promise<Partial<IUser>| null> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        return userWithoutPassword;
    }

}