// src/services/userBadgeService.ts
import { injectable, inject } from 'inversify';
import { IBadgeRepository } from '../../core/interfaces/repositories/IBadgeRepository';
import { IBadge } from '../../models/Badge';
import { TYPES } from '../../di/types';
import { IUser } from '../../models/User';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { SafeBadge } from '../../core/types/SafeBadge';
import { IUserBadgeService } from '../../core/interfaces/services/user/IUser.Badge.Service';

@injectable()
export class UserBadgeService implements IUserBadgeService{

  constructor(
    @inject(TYPES.BadgeRepository) private badgeRepository: IBadgeRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async getAvailableBadges(userId: string): Promise<IBadge[]> {
    return await this.badgeRepository.getAvailableBadges(userId);
  }

  async unlockBadge(userId: string, badgeId: string): Promise<IUser> {
    const user = await this.userRepository.findUserById(userId);
    const badge = await this.badgeRepository.findBadgeById(badgeId);

    if (!user || !badge) throw new Error('User or Badge not found');
    if (user.xp! < badge.requiredXp) throw new Error('Insufficient XP');
    if (user.badges!.some(b => b.badgeId.toString() === badgeId)) {
      throw new Error('Badge already acquired');
    }

    const updatedUser = await this.badgeRepository.addBadgeToUser(userId, badgeId);
    if (!updatedUser) throw new Error('Failed to unlock badge');
    return updatedUser;
  }

  async setCurrentBadge(userId: string, badgeId: string): Promise<IUser> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error('User not found');

    const hasBadge = user.badges!.some(b => b.badgeId.toString() === badgeId);
    if (!hasBadge) throw new Error('Badge not acquired');

    const updatedUser = await this.badgeRepository.updateCurrentBadge(userId, badgeId);
    if (!updatedUser) throw new Error('Failed to set current badge');
    return updatedUser;
  }

  async getUserBadges(userId: string): Promise<SafeBadge> {
    const result = await this.badgeRepository.getUserBadges(userId);
    if (!result) throw new Error('User not found');
    return result;
  }
}