import { injectable } from 'inversify';
import { IQuestionRepository } from '../core/interfaces/repositories/IQuestionRepository';
import { QuestionModel } from '../models/Question';
import { IQuestion } from '../models/Question';
import { BaseRepository } from './BaseRepository';

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
        .populate('createdBy')
        .populate('tags');
    }

    async countByType(type: string): Promise<number> {
      return QuestionModel.countDocuments({ type,isListed:true });
    }

    async findQuestionsByType(type: string, skip: number, limit: number): Promise<any[]> {
        return QuestionModel.aggregate([
            { $match: { type , isListed:true } },
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


}