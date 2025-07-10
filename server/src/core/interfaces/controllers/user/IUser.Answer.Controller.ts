import { Request, Response } from "express";

export interface IUserAnswerController{
    getAnswersByQuestion(req: Request, res: Response): Promise<void>;
    canUserAnswer(req: Request, res: Response): Promise<void>;
    createAnswer(req: Request, res: Response): Promise<void>;
    reactToAnswer(req: Request, res: Response): Promise<void>;
    removeAnswerReaction(req: Request, res: Response): Promise<void>;
    updateAnswerQuality(req: Request, res: Response): Promise<void>;
}