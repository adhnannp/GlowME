import { injectable } from 'inversify';
import { IQuestionRepository } from '../core/interfaces/repositories/IQuestionRepository';
import { QuestionModel } from '../models/Question';
import { IQuestion } from '../models/Question';
import { BaseRepository } from './BaseRepository';
import mongoose, { RootFilterQuery, Types } from 'mongoose';
import { Filter } from "mongodb";

@injectable()
export class QuestionRepository extends BaseRepository<IQuestion> implements IQuestionRepository{
    constructor() {
        super(QuestionModel);
    }

    async getQuestionByTitle(title:string): Promise<IQuestion | null>{
        return await QuestionModel.findOne({title});
    }

    async getQuestionBySlug(slug:string):Promise<IQuestion | null >{
        return await QuestionModel.findOne({slug})
        .select('-embedding')
        .populate({
          path: 'createdBy',
          select: '-password',
          populate: {
            path: 'currentBadge',
          }
        })
        .populate('tags');
    }

    async countByType(type: string,tagId:string): Promise<number> {
        const matchStage: RootFilterQuery<IQuestion> = {
          type,
          isListed: true,
        };
        if (tagId && mongoose.Types.ObjectId.isValid(tagId)) {
          matchStage.tags = { $in: [new mongoose.Types.ObjectId(tagId)] };
        }
        return QuestionModel.countDocuments(matchStage);
    }

    async findQuestionsByType(type: string, skip: number, limit: number,tagId?:string): Promise<any[]> {
        const matchStage: RootFilterQuery<IQuestion> = {
          type,
          isListed: true,
        };
    
        if (tagId && mongoose.Types.ObjectId.isValid(tagId)) {
          matchStage.tags = { $in: [new mongoose.Types.ObjectId(tagId)] };
        }
        return QuestionModel.aggregate([
            { $match: matchStage },
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
            $lookup: {
                from: 'reactions',
                localField: '_id',
                foreignField: 'entity_id',
                as: 'reactions',
                pipeline: [
                { $match: { entity_type: 'question' } },
                ]
            }
            },
            {
            $addFields: {
                voteScore: {
                $subtract: [
                    { $size: { $filter: { input: '$reactions', as: 'r', cond: { $eq: ['$$r.type', 'upvote'] } } } },
                    { $size: { $filter: { input: '$reactions', as: 'r', cond: { $eq: ['$$r.type', 'devote'] } } } }
                ]
                }
            }
            },

            {
            $lookup: {
                from: 'answers',
                localField: '_id',
                foreignField: 'question_id',
                as: 'answers'
            }
            },
            {
            $addFields: {
                answerCount: { $size: '$answers' }
            }
            },

            {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
            },
            {
            $unwind: {
                path: '$createdBy',
                preserveNullAndEmptyArrays: true
            }
            },

            {
                $lookup: {
                    from: 'badges',
                    localField: 'createdBy.currentBadge',
                    foreignField: '_id',
                    as: 'createdBy.currentBadge'
                }
                },
                {
                $unwind: {
                    path: '$createdBy.currentBadge',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
            },

            {
            $project: {
                reactions: 0,
                answers: 0
            }
            }
        ]);
    }

    async getTopTags(limit:number = 10): Promise<Types.ObjectId[]> {
      const tags = await QuestionModel.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 1 } }
      ]);
      return tags.map(tag => tag._id);
    }

}