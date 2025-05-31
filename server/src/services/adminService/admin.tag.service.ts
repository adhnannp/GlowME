import { IAdminTagService } from '../../core/interfaces/services/admin/IAdmin.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { tagNameSchema } from '../../validators/tagValidation';
import mongoose from 'mongoose';

@injectable()
export class AdminTagService implements IAdminTagService {
  constructor(
    @inject(TYPES.TagRepository)private tagRepository: ITagRepository
  ) {}

  async getAllTags(skip: number, limit: number, search: string): Promise<[ITag[], number]> {
    return this.tagRepository.getAllTags(skip, limit,search);
  }

  async createTag(name: string): Promise<ITag> {
    await this.checkName(name);
    return this.tagRepository.create({ name });
  }

  async editTagName(id: string, name: string): Promise<ITag | null> {
    const result = tagNameSchema.safeParse(name);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Invalid tag name';
      throw new Error(errorMessage);
    }
    const existingTag = await this.tagRepository.getTagByName(name);
    if (existingTag && (existingTag._id as mongoose.Types.ObjectId).toString() !== id) {
      throw new Error('Tag name already exists');
    }
    return this.tagRepository.update(id, { name });
  }

  async listTag(id: string): Promise<ITag | null> {
    return this.tagRepository.update(id, { isListed: true });
  }

  async unlistTag(id: string): Promise<ITag | null> {
    return this.tagRepository.update(id, { isListed: false });
  }

  private async checkName(name: string): Promise<void> {
    const result = tagNameSchema.safeParse(name);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Invalid tag name';
      throw new Error(errorMessage);
    }

    const existingTag = await this.tagRepository.getTagByName(name);
    if (existingTag) {
      throw new Error('Tag name already exists');
    }
  }

}
