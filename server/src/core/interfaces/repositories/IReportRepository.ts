import { IReport } from '../../../models/Report';
import GroupedReport from '../../types/Reports';

export interface IReportRepository {
  createReport(report: Partial<IReport>): Promise<IReport | null> ;
  getUserReports(userId: string): Promise<IReport[] | null> ;
  getReportedUserIds(reporterId: string): Promise<string[]>;
  getGroupedReports(): Promise<GroupedReport[]>;
}