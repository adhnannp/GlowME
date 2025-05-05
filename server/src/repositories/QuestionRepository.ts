import { injectable } from 'inversify';
// import { IQuestionRepository } from '../core/interfaces/repositories/IQuestionRepository';
import { QuestionModel } from '../models/Question';
import { IQuestion } from '../models/Question';

@injectable()
export class ReportRepository {
  async createQuestion(question: Partial<IQuestion>): Promise<IQuestion | null> {
    return await QuestionModel.create(question);
  }
}