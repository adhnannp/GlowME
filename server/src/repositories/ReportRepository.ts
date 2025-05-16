import { injectable } from 'inversify';
import { IReportRepository } from '../core/interfaces/repositories/IReportRepository';
import { ReportModel } from '../models/Report';
import { IReport } from '../models/Report';
import GroupedReport, { SafeUserWithId } from '../core/types/Reports';

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

  async getReportedUserIds(reporterId: string): Promise<string[]> {
    const reports = await ReportModel.find(
      { reporter: reporterId, status: { $in: ['pending', 'resolved'] } },
      'reported_user'
    ).lean();
    return reports.map((report) => report.reported_user.toString());
  }

  async getGroupedReports(): Promise<GroupedReport[]> {
    const reports = await ReportModel.find()
      .populate<{ reporter: SafeUserWithId }>('reporter','-password')
      .populate<{ reported_user: SafeUserWithId }>('reported_user','-password');

    const filteredReports = reports.filter(
      (report) => report.reported_user && !report.reported_user.isBlock
    );

    const groupedReportsMap = new Map<string, GroupedReport>();

    filteredReports.forEach((report) => {
      const reportedUserId = report.reported_user._id.toString();

      if (!groupedReportsMap.has(reportedUserId)) {
        groupedReportsMap.set(reportedUserId, {
          reportedUser: report.reported_user,
          reports: [],
        });
      }

      groupedReportsMap.get(reportedUserId)!.reports.push(report);
    });
    return Array.from(groupedReportsMap.values());
  }

  async rejectReport(id:string){
    return await ReportModel.findByIdAndUpdate(id,{$set:{status:"rejected"}},{new:true});
  }

  async rejectAllUserReport(reported_user:string){
    return await ReportModel.updateMany({reported_user,status:{$ne:"resolved"}},{$set:{status:"rejected"}})
  }

  async resolveReport(id:string){
    return await ReportModel.findByIdAndUpdate(id,{$set:{status:"resolved"}},{new:true});
  }

  async resolveAllUserReport(reported_user:string){
    return await ReportModel.updateMany({reported_user},{$set:{status:"resolved"}})
  }

}