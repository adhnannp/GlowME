import { AnswerQuality, IAnswer } from "../../../../models/Answer";

export interface IUserAnswerService{
    listAnswers(questionId: string, page: number, limit: number, userId?:string): Promise<{ answers: IAnswer[]; total: number; page: number; limit: number }>;
    createAnswer(payload: Partial<IAnswer>): Promise<IAnswer>;
    canUserAnswer(questionId: string, userId: string): Promise<{ canAnswer: boolean, alreadyAnswered: boolean }>;
    reactToAnswer(answerId: string, userId: string, type: 'upvote' | 'devote'): Promise<void>;
    removeAnswerReaction(answerId: string, userId: string): Promise<void>;
    updateAnswerQuality(answerId: string,newQuality: AnswerQuality,questionOwnerId: string): Promise<IAnswer>;
}