import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IAdminReportController from '../../core/interfaces/controllers/admin/IAdmin.report.Controller';
import IAdminReportService from '../../core/interfaces/services/admin/IAdmin.Report.Service';

@injectable()
export class AdminReportController implements IAdminReportController{
  constructor(
    @inject(TYPES.AdminReportService) private reportService: IAdminReportService
  ) {}

  async getAllUserReports(req:Request,res:Response):Promise<void>{
    try {
       const reports = await this.reportService.getUserGroupedReports();
       res.status(200).json({message:'reports fetrched successfully',reports})
       return
    } catch (error) {
        const err = error as Error
        res.status(400).json({message:err.message})
        return;
    }
  }
}