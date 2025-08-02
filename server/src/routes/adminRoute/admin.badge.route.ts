import { Router as Router_badge } from 'express';
import container_badge from '../../di/container';
import { TYPES as TYPES_badge } from '../../di/types';
import { IAdminBadgeController } from '../../core/interfaces/controllers/admin/IAdmin.Badge.Controller';
import { IAdminAuthMiddleware as IAdminAuthMiddleware_badge } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';
import { badgeUpload } from '../../config/multerConfig';

const badgeRouter = Router_badge();

const badgeController = container_badge.get<IAdminBadgeController>(TYPES_badge.AdminBadgeController);
const adminAuthMiddleware_badge = container_badge.get<IAdminAuthMiddleware_badge>(TYPES_badge.AdminAuthMiddleware);
const adminAuth_badge = adminAuthMiddleware_badge.handle.bind(adminAuthMiddleware_badge);

badgeRouter.get('/badges', adminAuth_badge, badgeController.getAllBadges.bind(badgeController));
badgeRouter.post('/badges', adminAuth_badge, badgeUpload.single('image'), badgeController.createBadge.bind(badgeController));
badgeRouter.patch('/badges/:badgeId', adminAuth_badge, badgeUpload.single('image'), badgeController.updateBadge.bind(badgeController));

badgeRouter.patch('/list-badge/:badgeId', adminAuth_badge, badgeController.listBadge.bind(badgeController));
badgeRouter.patch('/unlist-badge/:badgeId', adminAuth_badge, badgeController.unlistBadge.bind(badgeController));

export default badgeRouter;