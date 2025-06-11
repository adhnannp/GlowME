import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserQuestionController } from "../../core/interfaces/controllers/user/IUser.Question.Controller";
import { IUserQuestionService } from "../../core/interfaces/services/user/IUser.Question.Service";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/ResponseMessages";
import logger from "../../utils/logger";
import { baseQuestionForm } from "../../validators/baseQuestionForm";

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

  async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const userId = req.userId;
      if(!userId){
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
        return;
      }
      const parsed = baseQuestionForm.safeParse(body);
      if (!parsed.success) {
        const errorMsg = parsed.error.errors.map((e) => e.message).join(', ');
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: `Validation failed: ${errorMsg}` });
        return;
      }
      const imageFile = files?.image?.[0];
      const docFile = files?.document?.[0];
      let imageUrl: string | undefined;
      let documentUrl: string | undefined;
      if (imageFile) {
        if (!imageFile.mimetype.startsWith('image/')) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_IMG_TYPE });
          return;
        }
        imageUrl = await this.userquestionService.uploadToCloudinary(imageFile);
      }
      if (docFile) {
        const allowedDocs = [
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedDocs.includes(docFile.mimetype)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_DOC_TYPE });
          return;
        }
        documentUrl = await this.userquestionService.uploadToS3(docFile);
      }
      await this.userquestionService.createQuestion({
        ...parsed.data,
        createdBy:userId, 
        imageUrl,
        documentUrl,
      });
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.QUESTION_CREATED });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      logger.error(error);
    }
  }

}