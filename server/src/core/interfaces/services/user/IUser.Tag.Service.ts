import { ITag } from '../../../../models/Tag';

export interface IUserTagService {
  findOneById(id: string): Promise<ITag | null>;
  searchTags(query: string) :Promise<ITag[]>
}
