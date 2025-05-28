import { IQuestion } from '../../../models/Question';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery } from 'mongoose';

export interface IQuestionRepository extends IBaseRepository<IQuestion> {
    getQuestionByTitle(title:string): Promise<IQuestion | null>;
}
