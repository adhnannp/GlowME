import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IReportRepository } from '../../core/interfaces/repositories/IReportRepository';
import GroupedReport from '../../core/types/Reports';
import IAdminReportService from '../../core/interfaces/services/admin/IAdmin.Report.Service';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';

@injectable()
export class AdminReportService implements IAdminReportService {
    constructor(
        @inject(TYPES.ReportRepository) private reportRepo: IReportRepository,
        @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    ) {}

    async getUserGroupedReports(): Promise<GroupedReport[]> {
        const groupedReport = await this.reportRepo.getGroupedReports();
        if(!groupedReport || groupedReport.length == 0) throw new Error('no reports Found');
        return groupedReport;
    }

    async rejectOne(reportId: string): Promise<void> {
        const report = await this.reportRepo.findOneReport(reportId);
        if (!report) throw new Error('Report not found');
        await this.reportRepo.rejectReport(reportId);
    }

    async rejectAll(reportedUserId: string): Promise<void> {
        const user = await this.userRepo.findUserById(reportedUserId);
        if (!user) throw new Error('User not found');
        await this.reportRepo.rejectAllUserReport(reportedUserId);
    }

    async resolveOne(reportId: string): Promise<void> {
        const report = await this.reportRepo.findOneReport(reportId);
        if (!report) throw new Error('Report not found');
        await this.reportRepo.resolveReport(reportId);
    }

    async resolveAll(reportedUserId: string): Promise<void> {
        const user = await this.userRepo.findUserById(reportedUserId);
        if (!user) throw new Error('User not found');
        await this.reportRepo.resolveAllUserReport(reportedUserId);
    }
}     