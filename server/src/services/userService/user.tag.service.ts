// services/UserTagService.ts
import { IUserTagService } from '../../core/interfaces/services/user/IUser.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { injectable } from 'inversify';

@injectable()
export class UserTagService implements IUserTagService {
  constructor(private tagRepository: ITagRepository) {}

  async findOneById(id: string): Promise<ITag | null> {
    return this.tagRepository.findById(id);
  }
}
