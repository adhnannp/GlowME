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

}