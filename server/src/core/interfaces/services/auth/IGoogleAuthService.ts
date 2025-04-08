// src/interfaces/services/IGoogleAuthService.ts
import { Profile } from 'passport-google-oauth20';
import { IUser } from '../../../../models/User';

export interface IGoogleAuthService {
  validateOrCreateUser(profile: Profile): Promise<{ user: IUser; accessToken: string; refreshToken: string } | null>;
}
