import { inject, injectable } from 'inversify';
import { IGoogleAuthService } from '../../core/interfaces/services/auth/IGoogleAuthService';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { TYPES } from '../../di/types';
import { Profile } from 'passport-google-oauth20';
import { IUser } from '../../models/User';
import { signJWT, signRefreshToken } from '../../utils/token';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository
  ) {}

  async validateOrCreateUser(profile: Profile): Promise<{ user: IUser; accessToken: string; refreshToken: string } | null> {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName;
    // const profileImage = profile.photos?.[0]?.value;
    if (!email || !displayName) {
      return null;
    }
    const existing = await this.userRepo.findUserByEmail(email);
    if (existing) {
      if (existing.isBlock) {
        if (existing.ban_expires_at) {
          const banExpires = new Date(existing.ban_expires_at);
          throw new Error(`You are banned. Ban will expire at: ${banExpires.toLocaleString()}`);
        }
        throw new Error("You are banned permanently.");
      }
      const accessToken = signJWT({ userId: existing._id, isAdmin: existing.isAdmin });
      const refreshToken = signRefreshToken({ userId: existing._id, isAdmin: existing.isAdmin });
      return { user: existing, accessToken, refreshToken };
    }
  
    const newUserData: Partial<IUser> = {
      username: displayName,
      email,
      isGoogleUser: true,
    //   profile_image: profileImage,
    };
    const newUser = await this.userRepo.createGoogleUser(newUserData);
    const accessToken = signJWT({ userId: newUser._id, isAdmin: newUser.isAdmin });
    const refreshToken = signRefreshToken({ userId: newUser._id, isAdmin: newUser.isAdmin });
    return { user: newUser, accessToken, refreshToken };
  }
}
