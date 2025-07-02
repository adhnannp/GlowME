import { IReaction } from "../../../models/Reaction";
import { IBaseRepository } from "./IBaseRepository";

export default interface IReactionRepository extends IBaseRepository<IReaction>{
    getVoteScore(entityId: string,entityType:string): Promise<number>;
    UserReaction(userId: string, entity_id: string, entity_type:string): Promise<'upvote' | 'devote' | null>
}