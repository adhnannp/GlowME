import { inject, injectable } from 'inversify';
import { IUser } from '../../models/User';
import { TYPES } from '../../di/types';
import { IReportRepository } from '../../core/interfaces/repositories/IReportRepository';
import GroupedReport from '../../core/types/Reports';
import IAdminReportService from '../../core/interfaces/services/admin/IAdmin.Report.Service';

@injectable()
export class AdminReportService implements IAdminReportService {
    constructor(
        @inject(TYPES.ReportRepository) private reportRepo: IReportRepository,
    ) {}

    async getUserGroupedReports(): Promise<GroupedReport[]> {
        const groupedReport = await this.reportRepo.getGroupedReports();
        if(!groupedReport || groupedReport.length == 0) throw new Error('no reports Found');
        return groupedReport;
    }
}     