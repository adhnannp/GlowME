import { IAnswer } from "../models/Answer";
import { BaseRepository } from "./BaseRepository";
import { AnswerModel } from "../models/Answer";
import mongoose from "mongoose";
import { IAnswerRepository } from '../core/interfaces/repositories/IAnswerRepository';

export class AnswerRepository extends BaseRepository<IAnswer> implements IAnswerRepository{
  constructor() {
    super(AnswerModel);
  }

  async getAnswersByQuestionId(
    questionId: string,
    skip: number = 0,
    limit: number = 10,
    userId?: string,
  ): Promise<IAnswer[]> {
    return await AnswerModel.aggregate([
      { $match: { question_id: new mongoose.Types.ObjectId(questionId) } },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
    
      // Populate user info
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'badges',
          localField: 'user.currentBadge',
          foreignField: '_id',
          as: 'user.currentBadgeDetails'
        }
      },
      {
        $addFields: {
          'user.currentBadge': {
            $arrayElemAt: ['$user.currentBadgeDetails', 0]
          }
        }
      },
      { $project: { 'user.password': 0 } },
    
      // Lookup reactions
      {
        $lookup: {
          from: 'reactions',
          let: { answerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$entity_id', '$$answerId'] }, entity_type: 'answer' } },
            {
              $group: {
                _id: null,
                upvotes: {
                  $sum: { $cond: [{ $eq: ['$type', 'upvote'] }, 1, 0] }
                },
                devotes: {
                  $sum: { $cond: [{ $eq: ['$type', 'devote'] }, 1, 0] }
                },
                total: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                voteScore: { $subtract: ['$upvotes', '$devotes'] },
                total: 1
              }
            }
          ],
          as: 'reactionStats'
        }
      },
    
      // Add reaction stats
      {
        $addFields: {
          voteScore: { $ifNull: [{ $arrayElemAt: ['$reactionStats.voteScore', 0] }, 0] },
          totalReactions: { $ifNull: [{ $arrayElemAt: ['$reactionStats.total', 0] }, 0] }
        }
      },
    
      // Add totalReplies
      {
        $lookup: {
          from: 'replies',
          let: { answerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$answer_id', '$$answerId'] }
              }
            },
            { $count: 'count' }
          ],
          as: 'replyStats'
        }
      },
      {
        $addFields: {
          totalReplies: { $ifNull: [{ $arrayElemAt: ['$replyStats.count', 0] }, 0] }
        }
      },
    
      // Optional: user reaction
      ...(userId
        ? [
            {
              $lookup: {
                from: 'reactions',
                let: { answerId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$entity_id', '$$answerId'] },
                          { $eq: ['$user_id', new mongoose.Types.ObjectId(userId)] },
                          { $eq: ['$entity_type', 'answer'] }
                        ]
                      }
                    }
                  },
                  { $project: { _id: 0, type: 1 } }
                ],
                as: 'userReaction'
              }
            },
            {
              $addFields: {
                userReaction: { $ifNull: [{ $arrayElemAt: ['$userReaction.type', 0] }, null] }
              }
            }
          ]
        : []),
        
      { $project: { reactionStats: 0, replyStats: 0 } }
    ]).exec();
  }

  async countAnswersByQuestionId(questionId: string): Promise<number> {
    return await AnswerModel.countDocuments({ question_id: new mongoose.Types.ObjectId(questionId) });
  }
  
}