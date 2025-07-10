import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserAnswerService } from '../../core/interfaces/services/user/IUser.Answer.Service';
import { IUserAnswerController } from '../../core/interfaces/controllers/user/IUser.Answer.Controller';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';
import { baseAnswerForm } from '../../validators/baseAnswerForm';
import mongoose from 'mongoose';

@injectable()
export class UserAnswerController implements IUserAnswerController {
  constructor(
    @inject(TYPES.UserAnswerService) private answerService: IUserAnswerService
  ) {}

    async getAnswersByQuestion(req: Request, res: Response): Promise<void> {
        try {
          const { questionId } = req.params;
          const userId = req.userId;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const data = await this.answerService.listAnswers(questionId, page, limit, userId);
          res.status(STATUS_CODES.OK).json({...data,message: MESSAGES.FETCHED_ANSWERS});
        } catch (error) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
        }
    }

    async canUserAnswer(req: Request, res: Response): Promise<void> {
      try {
        const questionId = req.params.questionId;
        const userId = req.userId;
        if (!userId) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
          return;
        }
        if (!mongoose.Types.ObjectId.isValid(questionId)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_QUESTION_ID });
          return;
        }
        const result = await this.answerService.canUserAnswer(questionId, userId );
        res.status(STATUS_CODES.OK).json(result);
      } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      }
    }

    async createAnswer(req: Request, res: Response): Promise<void> {
        const parsed = baseAnswerForm.safeParse(req.body);
        if (!parsed.success) {
           res.status(STATUS_CODES.BAD_REQUEST).json({message:parsed.error.flatten().fieldErrors,});
           return;
        }
        const { answer, quality } = parsed.data;
        const question_id = req.body.question_id;

        if (!question_id || question_id.length !== 24) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_QUESTION_ID });
          return;
        }

        try {
          const payload = {
            question_id,
            user_id: req.userId,
            answer,
            quality,
          };

          const createdAnswer = await this.answerService.createAnswer(payload);
          res.status(STATUS_CODES.CREATED).json({ message:MESSAGES.ANSWER_CREATED, answer: createdAnswer });
        } catch (error) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message:(error as Error).message });
        }
    }

    async reactToAnswer(req: Request, res: Response): Promise<void> {
      try {
        const { answerId } = req.params;
        const { type } = req.body;
        const userId = req.userId;

        if (!['upvote', 'devote'].includes(type)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_REACTION });
          return;
        }

        if (!userId) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
          return;
        }

        await this.answerService.reactToAnswer(answerId, userId, type);
        res.status(STATUS_CODES.OK).json({ message: MESSAGES.REACTION_SAVED });
      } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      }
    }

    async removeAnswerReaction(req: Request, res: Response): Promise<void> {
      try {
        const { answerId } = req.params;
        const userId = req.userId;

        if (!userId) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
          return;
        }

        await this.answerService.removeAnswerReaction(answerId, userId);
        res.status(STATUS_CODES.OK).json({ message: MESSAGES.REACTION_REMOVED });
      } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      }
    }

    async updateAnswerQuality(req: Request, res: Response): Promise<void> {
      try {
        const { answerId } = req.params;
        const { quality } = req.body;
        const questionOwnerId = req.userId;

        if (!questionOwnerId) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
          return;
        }

        if (!['good', 'correct', 'ordinary'].includes(quality)) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_QUALITY });
          return;
        }

        const updated = await this.answerService.updateAnswerQuality(answerId, quality, questionOwnerId);
        res.status(STATUS_CODES.OK).json({ message: MESSAGES.QUALITY_UPDATED, answer: updated });
      } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
      }
    }

}
