import { IBaseRepository } from './IBaseRepository';
import { ITag } from '../../../models/Tag';

export interface ITagRepository extends IBaseRepository<ITag> {
    searchTag(regex:RegExp):Promise<ITag[]>;
    getAllTags(skip: number, limit: number, search: string): Promise<[ITag[], number]>
    getListedTags() :Promise<ITag[]>;
    getTagByName(name:string): Promise<ITag | null>;
}