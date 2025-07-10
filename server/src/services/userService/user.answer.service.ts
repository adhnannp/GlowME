import { IAnswerRepository } from '../../core/interfaces/repositories/IAnswerRepository';
import { AnswerQuality, IAnswer } from "../../models/Answer";
import { IUserAnswerService } from '../../core/interfaces/services/user/IUser.Answer.Service';
import { inject, injectable } from "inversify";
import { TYPES } from '../../di/types';
import { IQuestionRepository } from '../../core/interfaces/repositories/IQuestionRepository';
import mongoose from 'mongoose';
import IReactionRepository from '../../core/interfaces/repositories/IReactionRepository';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';

@injectable()
export class UserAnswerService implements IUserAnswerService{
  constructor(
    @inject(TYPES.AnswerRepository) private answerRepo: IAnswerRepository,
    @inject(TYPES.QuestionRepository) private questionRepo: IQuestionRepository,
    @inject(TYPES.ReactionRepository) private reactionRepo: IReactionRepository,
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
) {}

  async listAnswers(questionId: string, page: number = 1, limit: number = 10, userId?:string): Promise<{ answers: IAnswer[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [answers, total] = await Promise.all([
      this.answerRepo.getAnswersByQuestionId(questionId, skip, limit, userId),
      this.answerRepo.countAnswersByQuestionId(questionId),
    ]);

    return { answers, total, page, limit };
  }

  async createAnswer(payload: Partial<IAnswer>): Promise<IAnswer> {
      if (!payload.question_id || !payload.user_id) {
      throw new Error("Missing required fields: question_id or user_id");
    }

    const question = await this.questionRepo.findById(payload.question_id.toString());
    if (!question) {
      throw new Error("Question not found");
    }
  
    if (question.createdBy.toString() === payload.user_id.toString()) {
      throw new Error("You cannot answer your own question");
    }

    const alreadyAnswered = await this.answerRepo.findAll({
      question_id: payload.question_id,
      user_id: payload.user_id
    });

    if (alreadyAnswered.length > 0) {
      throw new Error("You have already answered this question");
    }

    const answer = await this.answerRepo.create(payload); 
    await this.userRepo.incrementXp(payload.user_id.toString(),1)
    return answer;
  }

  async canUserAnswer(questionId: string, userId: string): Promise<{ canAnswer: boolean, alreadyAnswered: boolean }> {
    const question = await this.questionRepo.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.createdBy.toString() === userId) {
      return { canAnswer: false, alreadyAnswered: false };
    }

    const existingAnswer = await this.answerRepo.findAll({
      question_id: questionId,
      user_id: userId,
    });

    if (existingAnswer.length > 0) {
      return { canAnswer: false, alreadyAnswered: true };
    }

    return { canAnswer: true, alreadyAnswered: false };
  }

  async reactToAnswer(answerId: string, userId: string, type: 'upvote' | 'devote'): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(answerId)) throw new Error("Invalid answer ID");
    const existingReaction = await this.reactionRepo.findOne({
      entity_id: answerId,
      user_id: userId,
      entity_type: 'answer',
    });

    if (existingReaction) {
      if (existingReaction.type === type) return;
      await this.reactionRepo.update((existingReaction._id as  mongoose.Types.ObjectId).toString(), { type });
    } else {
      await this.reactionRepo.create({
        entity_id: new mongoose.Types.ObjectId(answerId),
        user_id: new mongoose.Types.ObjectId(userId),
        entity_type: 'answer',
        type,
      });
    }
  }

  async removeAnswerReaction(answerId: string, userId: string): Promise<void> {
    await this.reactionRepo.deleteOne({
      entity_id: new mongoose.Types.ObjectId(answerId),
      user_id: new mongoose.Types.ObjectId(userId),
      entity_type: 'answer',
    });
  }

  async updateAnswerQuality(answerId: string,newQuality: AnswerQuality,questionOwnerId: string): Promise<IAnswer> {
    
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      throw new Error("Invalid answer ID");
    }

    const answer = await this.answerRepo.findById(answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }
    
    const question = await this.questionRepo.findById(answer.question_id.toString());
    if (!question || question.createdBy.toString() !== questionOwnerId) {
      throw new Error("You are not authorized to update this answer's quality");
    }
    
    const oldQuality = answer.quality ?? 'ordinary';
    
    if (oldQuality === newQuality) {
      throw new Error("Same quality — no changes made.");
    }
    
    const level = { ordinary: 1, good: 2, correct: 3 };
    const oldLevel = level[oldQuality];
    const newLevel = level[newQuality];
    
    if (newLevel < oldLevel) {
      throw new Error("Downgrading answer quality is not allowed.");
    }

    if (newQuality === 'correct') {
      const existingCorrect = await this.answerRepo.findOne({
        question_id: answer.question_id,
        quality: 'correct',
        _id: { $ne: answer._id },
      });
      if (existingCorrect) {
        throw new Error("There is already a correct answer for this question.");
      }
    }

    const updatedAnswer = await this.answerRepo.update(answerId, { quality: newQuality }) as IAnswer;

    const xpMap = { ordinary:0, good: 10, correct: 20 };
    const coinMap = { ordinary:0, good: 5, correct: 10 };

    const xpToAdd = (xpMap[newQuality] ?? 0) - (xpMap[oldQuality] ?? 0);
    let coinsToAdd = (coinMap[newQuality] ?? 0) - (coinMap[oldQuality] ?? 0);

    if (newQuality === 'correct' && question.type === 'bounty' && (question.bounty_coin ?? 0) > 10) {
      coinsToAdd += question.bounty_coin ?? 0;
    }

    if (xpToAdd > 0 || coinsToAdd > 0) {
      await this.userRepo.update(answer.user_id.toString(), {
        $inc: {
          xp: xpToAdd,
          coin_balance: coinsToAdd,
        },
      });
    }

    return updatedAnswer;
  }

}