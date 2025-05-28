import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserQuestionController } from "../../core/interfaces/controllers/user/IUser.Question.Controller";
import { IUserQuestionService } from "../../core/interfaces/services/user/IUser.Question.Service";

@injectable()
export class UserQuestionController implements IUserQuestionController {
  constructor(
    @inject(TYPES.UserQuestionService) private userquestionService: IUserQuestionService
  ) {}

  async checkTitleAvailablity(req:Request,res:Response):Promise<void>{
      try {
        const title = ( req.query.title as string)?.trim();
        console.log(title)
        if(!title){
            res.status(400).json({message:'invalid title'});
            return;
        }
        const isAvailable = await this.userquestionService.checkTitleAvailablity(title);
        const message = isAvailable
            ? 'Title is available'
            : 'Title is not available';
        res.status(200).json({isAvailable,message})
        return;
    } catch (error) {
        const err = error as Error  
        res.status(400).json({ message: err.message });
        return
    }
  }
}