import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IAdminReportController from '../../core/interfaces/controllers/admin/IAdmin.report.Controller';
import IAdminReportService from '../../core/interfaces/services/admin/IAdmin.Report.Service';
import { IUsersService } from '../../core/interfaces/services/admin/IUsersService';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminReportController implements IAdminReportController {
  constructor(
    @inject(TYPES.AdminReportService)
    private reportService: IAdminReportService,
    @inject(TYPES.UsersService) private usersService: IUsersService
  ) {}

  async getAllUserReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await this.reportService.getUserGroupedReports();
      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.REPORTS_FETCHED, reports });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      return;
    }
  }

  async rejectOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await this.reportService.rejectOne(id);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.REPORT_REJECTED });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      return;
    }
  }

  async rejectAll(req: Request, res: Response) : Promise<void>{
    const { userId } = req.params;
    try {
      await this.reportService.rejectAll(userId);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.ALL_REPORTS_REJECTED });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      return;
    }
  }

  async resolveOne(req: Request, res: Response) : Promise<void>{
    const { id } = req.params;
    try {
      await this.reportService.resolveOne(id);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.REPORT_RESOLVED });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      return;
    }
  }

  async banUserByReport(req: Request, res: Response) : Promise<void>{
    const { userId } = req.params;
    const { duration } = req.body;
    try {
      await this.usersService.banUser(userId, duration);
      await this.reportService.resolveAll(userId);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.REPORT_USER_BANNED });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      return;
    }
  }

}
