import { IBadge } from '../../../../models/Badge';
import { IUser } from '../../../../models/User';
import { SafeBadge } from '../../../types/SafeBadge';

export interface IUserBadgeService {
  getAvailableBadges(userId: string): Promise<IBadge[]>;
  unlockBadge(userId: string, badgeId: string): Promise<IUser>;
  setCurrentBadge(userId: string, badgeId: string): Promise<IUser>;
  getUserBadges(userId: string): Promise<SafeBadge>;
}
