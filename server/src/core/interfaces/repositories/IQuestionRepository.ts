import { IQuestion } from '../../../models/Question';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery } from 'mongoose';

export interface IQuestionRepository extends IBaseRepository<IQuestion> {
    getQuestionByTitle(title:string): Promise<IQuestion | null>;
    getQuestionBySlug(slug:string):Promise<IQuestion | null >
    countByType(type: string): Promise<number>;
    findQuestionsByType(type: string,skip: number,limit: number): Promise<IQuestion[]>;
}
