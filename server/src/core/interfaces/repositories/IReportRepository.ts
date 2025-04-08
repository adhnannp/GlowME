import { IReport } from '../../../models/Report';

export interface IReportRepository {
  createReport(report: Partial<IReport>): Promise<IReport | null> ;
  getUserReports(userId: string): Promise<IReport[] | null> ;
  getReportedUserIds(reporterId: string): Promise<string[]>;
}