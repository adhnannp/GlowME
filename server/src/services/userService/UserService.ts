import { inject, injectable } from 'inversify';
import { IUserService} from '../../core/interfaces/services/user/IUserService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';
import { SafeUser } from '../../core/types/SafeUser';
import { comparePassword } from '../../validators/comparePasswrod';

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

    async hasPassword(userId:string):Promise<boolean>{
        const user = await this.userRepository.findUserById(userId);
        if (!user || !user.email) throw new Error('User not found');
        const userWithPassword = await this.userRepository.findUserByEmail(user.email);
        if (!userWithPassword) throw new Error('User not found');
        return !!userWithPassword.password;
    }

    async changePassword(userId: string, oldPassword: string | undefined, newPassword: string, googleUser: boolean = false): Promise<SafeUser | null> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new Error('User not found');
        const userWithPassword = await this.userRepository.findUserByEmail(user.email);
        if (!userWithPassword) throw new Error('User not found');
        if (userWithPassword.password) {
            if (!oldPassword) throw new Error('Old password is required');
            if (oldPassword === newPassword) throw new Error('Old and new passwords cannot be the same');
            const validPass = await comparePassword(oldPassword,userWithPassword.password,);
            if (!validPass) throw new Error('Old password is incorrect');
        } else if (googleUser && !userWithPassword.password) {
        } else if (!userWithPassword.password && !googleUser) {
            throw new Error('No password set for this user. Try forgot password after logout');
        }
        const updatedUser = await this.userRepository.updateUserPassword(userId, newPassword);
        if (!updatedUser) throw new Error('Changing password failed');
        const { password, ...userWithoutPassword } = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
        return userWithoutPassword;
    }

}