import { IAdminTagService } from '../../core/interfaces/services/admin/IAdmin.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';

@injectable()
export class AdminTagService implements IAdminTagService {
  constructor(
    @inject(TYPES.TagRepository)private tagRepository: ITagRepository
  ) {}

  async getAllTags(): Promise<ITag[]> {
    return this.tagRepository.findAll();
  }

  async createTag(name: string): Promise<ITag> {
    return this.tagRepository.create({ name });
  }

  async editTagName(id: string, name: string): Promise<ITag | null> {
    return this.tagRepository.update(id, { name, edited_at: new Date() });
  }

  async listTag(id: string): Promise<ITag | null> {
    return this.tagRepository.update(id, { isListed: true });
  }

  async unlistTag(id: string): Promise<ITag | null> {
    return this.tagRepository.update(id, { isListed: false });
  }
}
