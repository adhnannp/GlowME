import { IUserTagService } from '../../core/interfaces/services/user/IUser.Tag.Service';
import { ITag } from '../../models/Tag';
import { ITagRepository } from '../../core/interfaces/repositories/ITagRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IQuestionRepository } from '../../core/interfaces/repositories/IQuestionRepository';

@injectable()
export class UserTagService implements IUserTagService {
  constructor(
    @inject(TYPES.TagRepository)private tagRepository: ITagRepository,
    @inject(TYPES.QuestionRepository)private questionRepo: IQuestionRepository
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

  async getTopTags():Promise<ITag[]>{
    const limit = 10
    const topTag = await this.questionRepo.getTopTags(limit);
    if(!topTag || !topTag.length ){
      return await this.tagRepository.getListedTags(limit);
    }
    return await this.tagRepository.findAll({_id:{$in:topTag}})
  }

}
