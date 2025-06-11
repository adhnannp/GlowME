import { Request, Response } from 'express';

export default interface IAdminCoinPlanController{
    createPlan(req: Request, res: Response): Promise<void>;
    getAllPlans(req: Request, res: Response): Promise<void>;
    updatePlan(req: Request, res: Response): Promise<void>;
    listPlan(req: Request, res: Response): Promise<void>;
    unlistPlan(req: Request, res: Response): Promise<void>;
};