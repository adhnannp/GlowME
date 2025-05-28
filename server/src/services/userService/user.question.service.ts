import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IQuestionRepository } from '../../core/interfaces/repositories/IQuestionRepository';
import { IUserQuestionService } from '../../core/interfaces/services/user/IUser.Question.Service';

@injectable()
export class UserQuestionService implements IUserQuestionService{

  constructor(
    @inject(TYPES.QuestionRepository) private questionRepo: IQuestionRepository,
  ) {}

  async checkTitleAvailablity(title:string) : Promise<boolean>{
    const question = await this.questionRepo.getQuestionByTitle(title)
    if(!question){
        return true;
    }
    return false;
  }

}