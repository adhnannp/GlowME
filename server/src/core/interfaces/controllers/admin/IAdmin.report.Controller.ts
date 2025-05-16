import { Request,Response } from "express";

export default interface IAdminReportController{
    getAllUserReports(req:Request,res:Response): Promise<void>;
}