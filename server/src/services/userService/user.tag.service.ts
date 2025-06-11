// services/UserTagService.ts
import { IUserTagService } from '../../core/interfaces/services/user/IUser.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';

@injectable()
export class UserTagService implements IUserTagService {
  constructor(
    @inject(TYPES.TagRepository)private tagRepository: ITagRepository
  ) {}

  async findOneById(id: string): Promise<ITag | null> {
    return this.tagRepository.findById(id);
  }

  async searchTags(query: string) :Promise<ITag[]>{
    if(!query){
      throw new Error('invalid query');
    }
    const regex = new RegExp(`${query}`, 'i');
    return this.tagRepository.searchTag(regex);
  }

}
