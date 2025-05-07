import { Request, Response } from "express";

export default interface IUserCoinPlanController{
    getCoinPlans(req: Request, res: Response): Promise<void>;
}