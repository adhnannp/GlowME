import { IBaseRepository } from './IBaseRepository';
import { ITag } from '../../../models/Tag';

export interface ITagRepository extends IBaseRepository<ITag> {
    searchTag(regex:RegExp):Promise<ITag[]>;
    getAllTags() :Promise<ITag[]>;
    getListedTags() :Promise<ITag[]>;
}