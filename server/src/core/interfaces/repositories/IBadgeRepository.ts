import { IBadge } from '../../../models/Badge';
import { IUser } from '../../../models/User';
import { SafeBadge } from '../../types/SafeBadge';

export interface IBadgeRepository {
  createBadge(badgeData: Partial<IBadge>): Promise<IBadge>;
  findBadgeById(badgeId: string): Promise<IBadge | null>;
  findBadgeByName(name: string): Promise<IBadge | null>;
  updateBadge(badgeId: string, updates: Partial<IBadge>): Promise<IBadge | null>;
  getAllBadges(): Promise<IBadge[]>;
  getAvailableBadges(userId: string): Promise<IBadge[]>;
  addBadgeToUser(userId: string, badgeId: string): Promise<IUser | null>;
  updateCurrentBadge(userId: string, badgeId: string): Promise<IUser | null>;
  getUserBadges(userId: string): Promise<SafeBadge | null>;
}
