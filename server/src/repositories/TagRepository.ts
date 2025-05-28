import { TagModel, ITag } from '../models/Tag';
import { BaseRepository } from './BaseRepository';
import { ITagRepository } from '../core/interfaces/repositories/ITagRepository';
import { injectable } from 'inversify';

@injectable()
export class TagRepository extends BaseRepository<ITag> implements ITagRepository {
  constructor() {
    super(TagModel);
  }

  async searchTag(regex:RegExp):Promise<ITag[]>{
    return TagModel.find({ name: regex, isListed: true }).limit(5).exec();
  }

  async getAllTags() :Promise<ITag[]> {
    return await TagModel.find();
  }

  async getListedTags() :Promise<ITag[]> {
    return await TagModel.find({isListed:true});
  }  

}
