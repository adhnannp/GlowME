import { IBadge } from '../../../models/Badge';
import { SafeBadge } from '../../types/SafeBadge';
import { SafeUser } from '../../types/SafeUser';

export interface IBadgeRepository {
  createBadge(badgeData: Partial<IBadge>): Promise<IBadge>;
  findBadgeById(badgeId: string): Promise<IBadge | null>;
  findBadgeByName(name: string): Promise<IBadge | null>;
  listBadge(badgeId:string):Promise<IBadge | null>;
  unlistBadge(badgeId:string):Promise<IBadge | null>;
  updateBadge(badgeId: string, updates: Partial<IBadge>): Promise<IBadge | null>;
  getAllBadges(): Promise<IBadge[]>;
  getAvailableBadges(userId: string): Promise<IBadge[]>;
  addBadgeToUser(userId: string, badgeId: string): Promise<SafeUser | null>;
  updateCurrentBadge(userId: string, badgeId: string): Promise<SafeUser | null>;
  getUserBadges(userId: string): Promise<SafeBadge | null>;
}
