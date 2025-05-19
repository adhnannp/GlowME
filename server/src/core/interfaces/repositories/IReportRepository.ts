import { IReport } from '../../../models/Report';
import GroupedReport from '../../types/Reports';

export interface IReportRepository {
  createReport(report: Partial<IReport>): Promise<IReport | null> ;
  findPendingReport(reporterId: string, reportedId: string): Promise<IReport | null>;
  getUserReports(userId: string): Promise<IReport[] | null> ;
  getReportedUserIds(reporterId: string): Promise<string[]>;
  getGroupedReports(): Promise<GroupedReport[]>;
  findOneReport(id:string):Promise<IReport | null>;
  rejectReport(id: string): Promise<void> ;
  rejectAllUserReport(reported_user: string): Promise<void>;
  resolveReport(id: string): Promise<void>;
  resolveAllUserReport(reported_user: string): Promise<void>;
}