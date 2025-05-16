import GroupedReport from "../../../types/Reports";

export default interface IAdminReportService{
    getUserGroupedReports(): Promise<GroupedReport[]>
}