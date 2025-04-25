import { IBadge } from '../../../../models/Badge';

export interface IAdminBadgeService {
  createBadge(name: string, requiredXp: number, imageFile: Express.Multer.File): Promise<IBadge>;
  updateBadge(badgeId: string, name?: string, requiredXp?:number, imageFile?: Express.Multer.File): Promise<IBadge>;
  listBadge(badgeId:string):Promise<IBadge>;
  unlistBadge(badgeId:string):Promise<IBadge>;
  getAllBadges(): Promise<IBadge[]>;
}
