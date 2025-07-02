import { injectable } from 'inversify';
import IReactionRepository from '../core/interfaces/repositories/IReactionRepository';
import { BaseRepository } from './BaseRepository';
import { IReaction, ReactionModel } from '../models/Reaction';
import mongoose from 'mongoose';

@injectable()
export class ReactionRepository extends BaseRepository<IReaction> implements IReactionRepository{
    constructor() {
        super(ReactionModel);
    }

    async getVoteScore(entityId: string,entityType:string): Promise<number> {
      const [result] = await ReactionModel.aggregate([
        {
          $match: {
            entity_id: new mongoose.Types.ObjectId(entityId),
            entity_type: entityType,
          },
        },
        {
          $group: {
            _id: '$entity_id',
            upvotes: {
              $sum: {
                $cond: [{ $eq: ['$type', 'upvote'] }, 1, 0],
              },
            },
            devotes: {
              $sum: {
                $cond: [{ $eq: ['$type', 'devote'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            voteScore: { $subtract: ['$upvotes', '$devotes'] },
          },
        },
      ]);

      return result?.voteScore ?? 0;
    }

    async UserReaction(userId: string, entity_id: string, entity_type:string): Promise<'upvote' | 'devote' | null> {
      const reaction = await ReactionModel.findOne({
        user_id: userId,
        entity_id,
        entity_type,
      }).select('type');  
      return reaction ? reaction.type : null;
    }


}