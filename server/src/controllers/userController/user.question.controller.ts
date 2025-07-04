import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserQuestionController } from '../../core/interfaces/controllers/user/IUser.Question.Controller';
import { IUserQuestionService } from '../../core/interfaces/services/user/IUser.Question.Service';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';
import logger from '../../utils/logger';
import { baseQuestionForm } from '../../validators/baseQuestionForm';
import mongoose from 'mongoose';

@injectable()
export class UserQuestionController implements IUserQuestionController {
  constructor(
    @inject(TYPES.UserQuestionService) private userQuestionService: IUserQuestionService
  ) {}

  async checkTitleAvailablity(req:Request,res:Response):Promise<void>{
      try {
        const title = ( req.query.title as string)?.trim();
        console.log(title);
        if(!title){
            res.status(STATUS_CODES.BAD_REQUEST).json({message:MESSAGES.INVALID_TITLE});
            return;
        }
        const isAvailable = await this.userQuestionService.checkTitleAvailablity(title);
        const message = isAvailable
            ? MESSAGES.TITLE_AVAILABLE
            : MESSAGES.TITLE_UNAVAILABLE;
        res.status(STATUS_CODES.OK).json({isAvailable,message});
        return;
    } catch (error) {
        const err = error as Error;  
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
        return;
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
        imageUrl = await this.userQuestionService.uploadToCloudinary(imageFile);
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
        documentUrl = await this.userQuestionService.uploadToS3(docFile);
      }
      await this.userQuestionService.createQuestion({
        ...parsed.data,
        createdBy:userId, 
        imageUrl,
        documentUrl,
      });
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.QUESTION_CREATED });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      logger.error(error);
      return;
    }
  }

  async getQuestionsByType(req:Request,res:Response) : Promise<void>{
    try {
      const { 'q-type': qType, page = 1 } = req.query;
      const parsedPage = parseInt(page as string);
      const limit = 20
      if(!qType || !page || parsedPage<1){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      const skip = (parsedPage - 1) * limit;
      const [questions,total] = await this.userQuestionService.listQuestionsByType(qType as string,parsedPage,limit);
      res.status(STATUS_CODES.OK).json({ questions , page:parsedPage , skip , total , limit, message: MESSAGES.FETCHED_QUESTIONS });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      return;
    }
  }

  async getOneBySlug(req:Request,res:Response):Promise<void>{
    try {
      const slug = req.params.slug
      const userId = req.userId;
      if(!userId){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_INVALID_OR_BANNED });
        return;
      }
      if(!slug || typeof slug != 'string'){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_SLUG });
        return;
      }
      const {question,totalVotes,userReaction} = await this.userQuestionService.getQuestionBySlug(slug,userId);
      res.status(STATUS_CODES.OK).json({ question, totalVotes, userReaction, message: MESSAGES.FETCHED_ONE_QUESTION });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      return;
    }
  }

  async findSimilarQuetions(req:Request,res:Response):Promise<void>{
    try {
      const text = req.body.text
      if(!text || typeof text != 'string'){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_INPUT });
        return;
      }
      const questions = await this.userQuestionService.getSimilarQuestions(text);
      res.status(STATUS_CODES.OK).json({ questions , message: MESSAGES.FETCHED_QUESTIONS });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      return;
    }
  }

  async relatedQuestions(req:Request,res:Response):Promise<void>{
    try {
      const questionId = req.params.id;
      if(!questionId || typeof questionId != 'string'|| !mongoose.Types.ObjectId.isValid(questionId)){
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
          return;
      }
      const relatedQuestions = await this.userQuestionService.getRelatedQuestion(questionId)
      res.status(STATUS_CODES.OK).json({ relatedQuestions , message: MESSAGES.FETCHED_QUESTIONS });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      return;
    }
  }

}