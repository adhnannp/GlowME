import { IBadge } from '../../../../models/Badge';

export interface IAdminBadgeService {
  createBadge(name: string, requiredXp: number, imageFile: Express.Multer.File): Promise<IBadge>;
  updateBadge(badgeId: string, name?: string, imageFile?: Express.Multer.File): Promise<IBadge>;
  getAllBadges(): Promise<IBadge[]>;
}
