import { Request, Response } from 'express';

export default interface IUserCoinPlanController{
    getCoinPlans(req: Request, res: Response): Promise<void>;
    createCoinPlanCheckoutSession(req: Request, res: Response): Promise<void>;
    getCheckoutSessionDetails(req: Request, res: Response): Promise<void>;
    getUserTransactionHistory(req: Request, res: Response) : Promise<void>;
};