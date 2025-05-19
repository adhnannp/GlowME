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

  async findPendingReport(reporterId: string, reportedId: string): Promise<IReport | null> {
    return await ReportModel.findOne({
      reporter: reporterId,
      reported_user: reportedId,
      status: 'pending',
    });
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
      const groupedReports = Array.from(groupedReportsMap.values()).filter(
        (group) => group.reports.some((r) => r.status === 'pending')
      );
      return groupedReports;
  }

  async findOneReport(id:string):Promise<IReport | null>{
    return await ReportModel.findById(id)
  }

  async rejectReport(id: string): Promise<void> {
    await ReportModel.updateOne(
      { _id: id },
      { $set: { status: "rejected" } }
    );
  }

  async rejectAllUserReport(reported_user: string): Promise<void> {
    await ReportModel.updateMany(
      { reported_user, status: { $ne: "resolved" } },
      { $set: { status: "rejected" } }
    );
  }

  async resolveReport(id: string): Promise<void> {
    await ReportModel.updateOne(
      { _id: id },
      { $set: { status: "resolved" } }
    );
  }

  async resolveAllUserReport(reported_user: string): Promise<void> {
    await ReportModel.updateMany(
      { reported_user, status: { $ne: "rejected" } },
      { $set: { status: "resolved" } }
    );
  }

}