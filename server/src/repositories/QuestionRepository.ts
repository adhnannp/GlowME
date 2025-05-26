import { injectable } from 'inversify';
import { IQuestionRepository } from '../core/interfaces/repositories/IQuestionRepository';
import { QuestionModel } from '../models/Question';
import { IQuestion } from '../models/Question';
import { BaseRepository } from './BaseRepository';
import { FilterQuery } from 'mongoose';

@injectable()
export class QuestionRepository extends BaseRepository<IQuestion> implements IQuestionRepository{
    constructor() {
        super(QuestionModel);
    }

    async listQuestions(filter: FilterQuery<IQuestion> = {}): Promise<IQuestion[]> {
        return this.findAll({ ...filter, isListed: true });
    }

    async unlistQuestion(id: string): Promise<IQuestion | null> {
        return this.update(id, { isListed: false });
    }

    async archiveQuestion(id: string): Promise<IQuestion | null> {
        return this.update(id, { is_archive: true });
    }

    async editQuestion(id: string, data: Partial<IQuestion>): Promise<IQuestion | null> {
        return this.update(id, data);
    }

    async getQuestionsByUser(userId: string): Promise<IQuestion[]> {
        return this.findAll({ createdBy: userId });
    }
}