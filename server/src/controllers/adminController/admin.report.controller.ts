import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import IAdminReportController from "../../core/interfaces/controllers/admin/IAdmin.report.Controller";
import IAdminReportService from "../../core/interfaces/services/admin/IAdmin.Report.Service";
import { IUsersService } from "../../core/interfaces/services/admin/IUsersService";

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
        .status(200)
        .json({ message: "reports fetrched successfully", reports });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  async rejectOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await this.reportService.rejectOne(id);
      res.status(200).json({ message: "Report rejected successfully." });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  async rejectAll(req: Request, res: Response) : Promise<void>{
    const { userId } = req.params;
    try {
      await this.reportService.rejectAll(userId);
      res.status(200).json({ message: "All reports rejected for user." });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  async resolveOne(req: Request, res: Response) : Promise<void>{
    const { id } = req.params;
    try {
      await this.reportService.resolveOne(id);
      res.status(200).json({ message: "Report resolved successfully." });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  async banUserByReport(req: Request, res: Response) : Promise<void>{
    const { userId } = req.params;
    const { duration } = req.body;
    try {
      await this.usersService.banUser(userId, duration);
      await this.reportService.resolveAll(userId)
      res.status(200).json({ message: `User banned based on reports.` });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

}
