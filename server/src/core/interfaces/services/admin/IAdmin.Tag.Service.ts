import { ITag } from "../../../../models/Tag";

export interface IAdminTagService {
  getAllTags(): Promise<ITag[]>
  createTag(name: string): Promise<ITag>;
  editTagName(id: string, name: string): Promise<ITag | null>;
  listTag(id: string): Promise<ITag | null>;
  unlistTag(id: string): Promise<ITag | null>;
}
