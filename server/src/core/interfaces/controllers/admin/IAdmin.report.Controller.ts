import { Request,Response } from 'express';

export default interface IAdminReportController{
    getAllUserReports(req:Request,res:Response): Promise<void>;
    rejectOne(req: Request, res: Response): Promise<void> ;
    rejectAll(req: Request, res: Response) : Promise<void>;
    resolveOne(req: Request, res: Response) : Promise<void>;
    banUserByReport(req: Request, res: Response) : Promise<void>;
};