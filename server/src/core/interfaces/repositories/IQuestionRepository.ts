import { IQuestion } from '../../../models/Question';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery } from 'mongoose';

export interface IQuestionRepository extends IBaseRepository<IQuestion> {
    listQuestions(filter?: FilterQuery<IQuestion>): Promise<IQuestion[]>;
    unlistQuestion(id: string): Promise<IQuestion | null>;
    archiveQuestion(id: string): Promise<IQuestion | null>;
    editQuestion(id: string, data: Partial<IQuestion>): Promise<IQuestion | null>;
    getQuestionsByUser(userId: string): Promise<IQuestion[]>;
}
