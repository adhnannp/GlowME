import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserQuestionController } from "../../core/interfaces/controllers/user/IUser.Question.Controller";
import { IUserQuestionService } from "../../core/interfaces/services/user/IUser.Question.Service";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/ResponseMessages";

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
            res.status(STATUS_CODES.BAD_REQUEST).json({message:MESSAGES.INVALID_TITLE});
            return;
        }
        const isAvailable = await this.userquestionService.checkTitleAvailablity(title);
        const message = isAvailable
            ? MESSAGES.TITLE_AVAILABLE
            : MESSAGES.TITLE_UNAVAILABLE;
        res.status(STATUS_CODES.OK).json({isAvailable,message})
        return;
    } catch (error) {
        const err = error as Error  
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return
    }
  }
}