import { injectable, inject } from 'inversify';
import { IRewardRepository } from '../../core/interfaces/repositories/IRewardRepository';
import { IReward } from '../../models/Reward';
import { IAdminRewardService } from '../../core/interfaces/services/admin/IAdmin.Reward.Service';
import { TYPES } from '../../di/types';
import { v2 as cloudinary } from 'cloudinary';
import extractCloudinaryPublicId from '../../utils/extractCloudinaryPublicId';
import { rewardSchema, rewardUpdateSchema } from '../../validators/rewardValidation';

@injectable()
export class AdminRewardService implements IAdminRewardService {
  constructor(
    @inject(TYPES.RewardRepository) private rewardRepository: IRewardRepository
  ) {}

  async createReward(
    name: string,
    coin: number,
    imageFile: Express.Multer.File,
    description: string
  ): Promise<IReward> {
    const parsed = rewardSchema.safeParse({ name, coin, description });
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message);
    }
    const existing = await this.rewardRepository.findOne({ name });
    if (existing) throw new Error('Reward with this name already exists');
    let imageUrl: string | undefined;
    if (imageFile) {
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: 'rewards',
        resource_type: 'image',
      });
      imageUrl = uploadResult.secure_url;
    }
    return await this.rewardRepository.create({
      name,
      coin,
      coverImage: imageUrl,
      description,
    });
  }

  async updateReward(
    rewardId: string,
    name?: string,
    coin?: number,
    imageFile?: Express.Multer.File,
    description?: string
  ): Promise<IReward> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward) throw new Error('Reward not found');
    const parsed = rewardUpdateSchema.safeParse({ name, coin, description });
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message);
    }
    const updates: Partial<IReward> = { ...parsed.data };
    if (name && name !== reward.name) {
      const existing = await this.rewardRepository.findOne({ name });
      if (existing) throw new Error('Reward name already exists');
      updates.name = name;
    }
    if (coin !== undefined) updates.coin = coin;
    if (description !== undefined) updates.description = description;
    if (imageFile) {
      if (reward.coverImage) {
        const publicId = extractCloudinaryPublicId(reward.coverImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => {});
        }
      }
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: 'rewards',
        resource_type: 'image',
      });
      updates.coverImage = uploadResult.secure_url;
    }
    const updated = await this.rewardRepository.update(rewardId, updates);
    if (!updated) throw new Error('Failed to update reward');
    return updated;
  }

  async unlistReward(rewardId: string): Promise<IReward> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward || !reward.isListed) throw new Error('Reward not found or already unlisted');
    const updated = await this.rewardRepository.update(rewardId, { isListed: false });
    if (!updated) throw new Error('Failed to unlist reward');
    return updated;
  }

  async listReward(rewardId: string): Promise<IReward> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward || reward.isListed) throw new Error('Reward not found or already listed');
    const updated = await this.rewardRepository.update(rewardId, { isListed: true });
    if (!updated) throw new Error('Failed to list reward');
    return updated;
  }

  async getAllRewards(): Promise<IReward[]> {
    return this.rewardRepository.findAll();
  }

  async getRewardById(rewardId: string): Promise<IReward> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward) throw new Error('Reward not found');
    return reward;
  }
}
