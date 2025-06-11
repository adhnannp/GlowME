import { injectable, inject } from 'inversify';
import { IBadgeRepository } from '../../core/interfaces/repositories/IBadgeRepository';
import { IBadge } from '../../models/Badge';
import { TYPES } from '../../di/types';
import path from 'path';
import { promises as fs } from 'fs';
import { IAdminBadgeService } from '../../core/interfaces/services/admin/IAdmin.Badge.Service';

@injectable()
export class AdminBadgeService implements IAdminBadgeService{

  constructor(
    @inject(TYPES.BadgeRepository) private badgeRepository: IBadgeRepository,
  ) {}

  async createBadge(name: string, requiredXp: number, imageFile: Express.Multer.File): Promise<IBadge> {
    if (await this.badgeRepository.findBadgeByName(name)) {
      throw new Error('Badge name already exists');
    }

    const imagePath = `/badges/${imageFile.filename}`;
    const badge = await this.badgeRepository.createBadge({
      name,
      image: imagePath,
      requiredXp
    });

    return badge;
  }

  async updateBadge(badgeId: string, name?: string, requiredXp?:number ,imageFile?: Express.Multer.File): Promise<IBadge> {
    const badge = await this.badgeRepository.findBadgeById(badgeId);
    if (!badge) throw new Error('Badge not found');

    const updates: Partial<IBadge> = {};
    if (name) {
      if (name !== badge.name && (await this.badgeRepository.findBadgeByName(name))) {
        throw new Error('Badge name already exists');
      }
      updates.name = name;
    }
    if(requiredXp){
      updates.requiredXp = requiredXp;
    }

    if (imageFile) {
      const oldImagePath = path.join(__dirname, '../../../public', badge.image);
      await fs.unlink(oldImagePath).catch(() => {});
      updates.image = `/badges/${imageFile.filename}`;
    }

    const updatedBadge = await this.badgeRepository.updateBadge(badgeId, updates);
    if (!updatedBadge) throw new Error('Failed to update badge');
    return updatedBadge;
  }

  async listBadge(badgeId:string):Promise<IBadge>{
    const badge = await this.badgeRepository.findBadgeById(badgeId);
    if (!badge || badge.isListed) throw new Error('Badge not found or allready listed');
    const listedBadge = await this.badgeRepository.listBadge(badgeId);
    if(!listedBadge) throw new Error ('Failed to list the badge');
    return listedBadge;
  }

  async unlistBadge(badgeId:string):Promise<IBadge>{
    const badge = await this.badgeRepository.findBadgeById(badgeId);
    if (!badge || !badge.isListed) throw new Error('Badge not found or allready unlisted');
    const listedBadge = await this.badgeRepository.unlistBadge(badgeId);
    if(!listedBadge) throw new Error ('Failed to unlist the badge');
    return listedBadge;
  }

  async getAllBadges(): Promise<IBadge[]> {
    return await this.badgeRepository.getAllBadges();
  }
}