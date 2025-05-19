import GroupedReport from "../../../types/Reports";

export default interface IAdminReportService{
    getUserGroupedReports(): Promise<GroupedReport[]>;
    rejectOne(reportId: string): Promise<void>;
    rejectAll(reportedUserId: string): Promise<void>;
    resolveOne(reportId: string): Promise<void>;
    resolveAll(reportedUserId: string): Promise<void>;
}