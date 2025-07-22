import { Router as Router_report } from 'express';
import container_report from '../../di/container';
import { TYPES as TYPES_report } from '../../di/types';
import IAdminReportController from '../../core/interfaces/controllers/admin/IAdmin.report.Controller';
import { IAdminAuthMiddleware as IAdminAuthMiddleware_report } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';

const reportRouter = Router_report();

const reportController = container_report.get<IAdminReportController>(TYPES_report.AdminReportController);
const adminAuthMiddleware_report = container_report.get<IAdminAuthMiddleware_report>(TYPES_report.AdminAuthMiddleware);
const adminAuth_report = adminAuthMiddleware_report.handle.bind(adminAuthMiddleware_report);

reportRouter.get('/reports/users', adminAuth_report, reportController.getAllUserReports.bind(reportController));
reportRouter.patch('/reports/reject/:id', adminAuth_report, reportController.rejectOne.bind(reportController));
reportRouter.patch('/reports/reject-all/:userId', adminAuth_report, reportController.rejectAll.bind(reportController));
reportRouter.patch('/reports/ban-user/:userId', adminAuth_report, reportController.banUserByReport.bind(reportController));

export default reportRouter;