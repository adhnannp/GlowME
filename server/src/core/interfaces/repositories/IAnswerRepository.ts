import { IAnswer } from "../../../models/Answer";
import { IBaseRepository } from "./IBaseRepository";

export interface IAnswerRepository extends IBaseRepository<IAnswer>{
    getAnswersByQuestionId(questionId: string,skip: number,limit: number, userId?: string): Promise<IAnswer[]>;
    countAnswersByQuestionId(questionId: string): Promise<number>;
}