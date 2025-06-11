import { inject, injectable } from 'inversify';
import { IUserService, UpdateProfileData } from '../../core/interfaces/services/user/IUserService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';
import { SafeUser } from '../../core/types/SafeUser';
import { comparePassword } from '../../validators/comparePasswrod';
import cloudinary from '../../config/cloudinary';
import extractCloudinaryPublicId from '../../utils/extractCloudinaryPublicId';



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

    async updateUserProfile(userId: string, data: UpdateProfileData): Promise<SafeUser> {
        if (!userId || !data.username) {
            throw new Error('Invalid Credentials');
        }

        const currentUser = await this.userRepository.findUserById(userId);
        if (!currentUser) {
            throw new Error('User not found');
        }

        let profileImageUrl: string | undefined;
        if (data.profile_image) {
            if (currentUser.profile_image) {
                try {
                  const publicId = extractCloudinaryPublicId(currentUser.profile_image);
                  if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                  }
                } catch (err) {
                  const error = err as Error;
                  console.warn(`Failed to delete old profile image: ${error.message}`);
                }
            }
            const base64Image = `data:${data.profile_image.mimetype};base64,${data.profile_image.buffer.toString('base64')}`;
            const uploadResult = await cloudinary.uploader.upload(
              base64Image,
              {
                folder: 'profile_images',
                resource_type: 'image',
              }
            );
            profileImageUrl = uploadResult.secure_url;
        }
        const updatedUser = await this.userRepository.updateUserProfile(userId, {
          username: data.username,
          profile_image: profileImageUrl,
        });

        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
    }

}