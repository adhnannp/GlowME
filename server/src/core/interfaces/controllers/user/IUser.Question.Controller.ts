import { Request, Response } from 'express';

export interface IUserQuestionController {
    checkTitleAvailablity(req:Request,res:Response):Promise<void>;
    createQuestion(req:Request,res:Response):Promise<void>;
    getQuestionsByType(req:Request,res:Response) : Promise<void>;
    getOneBySlug(req:Request,res:Response) : Promise<void>;
    findSimilarQuetions(req:Request,res:Response):Promise<void>;
    relatedQuestions(req:Request,res:Response):Promise<void>;
    reactToQuestion(req: Request, res: Response): Promise<void>;
    removeQuestionReaction(req: Request, res: Response): Promise<void>;
}