import { injectable } from 'inversify';
import { IReportRepository } from '../core/interfaces/repositories/IReportRepository';
import { ReportModel } from '../models/Report';
import { IReport } from '../models/Report';

@injectable()
export class ReportRepository implements IReportRepository {
  async createReport(report: Partial<any>): Promise<IReport | null> {
    return await ReportModel.create(report);
  }

  async getUserReports(userId: string): Promise<IReport[] | null> {
    return await ReportModel.find({ reported_user: userId })
      .populate('reporter', 'username')
      .lean();
  }
}