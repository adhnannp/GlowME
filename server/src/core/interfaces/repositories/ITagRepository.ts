import { IBaseRepository } from './IBaseRepository';
import { ITag } from '../../../models/Tag';

export interface ITagRepository extends IBaseRepository<ITag> {
    getAllTags() :Promise<ITag[]>;
    getListedTags() :Promise<ITag[]>;
}