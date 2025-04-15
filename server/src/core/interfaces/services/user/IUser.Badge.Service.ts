import { IBadge } from '../../../../models/Badge';
import { SafeBadge } from '../../../types/SafeBadge';
import { SafeUser } from '../../../types/SafeUser';

export interface IUserBadgeService {
  getAvailableBadges(userId: string): Promise<IBadge[]>;
  unlockBadge(userId: string, badgeId: string): Promise<SafeUser>;
  setCurrentBadge(userId: string, badgeId: string): Promise<SafeUser>;
  getUserBadges(userId: string): Promise<SafeBadge>;
}
