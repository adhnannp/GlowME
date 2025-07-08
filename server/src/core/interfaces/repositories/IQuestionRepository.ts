import { IQuestion } from '../../../models/Question';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, Types } from 'mongoose';

export interface IQuestionRepository extends IBaseRepository<IQuestion> {
    getQuestionByTitle(title:string): Promise<IQuestion | null>;
    getQuestionBySlug(slug:string):Promise<IQuestion | null >
    countByType(type: string,tagId?:string): Promise<number>;
    findQuestionsByType(type: string,skip: number,limit: number,tagId?:string): Promise<IQuestion[]>;
     getTopTags(limit:number): Promise<Types.ObjectId[]>;
}
