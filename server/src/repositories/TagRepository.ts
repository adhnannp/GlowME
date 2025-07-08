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

  async getAllTags(skip: number, limit: number, search: string): Promise<[ITag[], number]> {
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    const tags = await TagModel.find(query).skip(skip).limit(limit).exec();
    const totalTags = await TagModel.countDocuments(query);
    return [tags, totalTags];
  }

  async getListedTags(limit:number = 10) :Promise<ITag[]> {
    return await TagModel.find({isListed:true}).limit(limit);
  }
  
  async getTagByName(name:string): Promise<ITag | null> {
    return await TagModel.findOne({name});
  }

}
