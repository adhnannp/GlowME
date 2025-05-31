import { ITag } from "../../../../models/Tag";

export interface IAdminTagService {
  getAllTags(skip: number, limit: number, search: string): Promise<[ITag[], number]>
  createTag(name: string): Promise<ITag>;
  editTagName(id: string, name: string): Promise<ITag | null>;
  listTag(id: string): Promise<ITag | null>;
  unlistTag(id: string): Promise<ITag | null>;
}
