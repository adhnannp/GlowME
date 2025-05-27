import { IAdminTagService } from '../../core/interfaces/services/admin/IAdmin.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { injectable } from 'inversify';

@injectable()
export class AdminTagService implements IAdminTagService {
  constructor(private tagRepository: ITagRepository) {}

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
