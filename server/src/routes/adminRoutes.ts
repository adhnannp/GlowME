import express from 'express';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import container from '../di/container';
import { TYPES } from '../di/types';
import { IAdminController } from '../core/interfaces/controllers/admin/IAdminController';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
import { IUsersController } from '../core/interfaces/controllers/admin/IUsersController';
import { IAdminBadgeController } from '../core/interfaces/controllers/admin/IAdmin.Badge.Controller';
import { badgeUpload, reward_Picture } from '../config/multerConfig';
import IAdminCoinPlanController from '../core/interfaces/controllers/admin/IAdmin.CoinPlan.Controller';
import IAdminReportController from '../core/interfaces/controllers/admin/IAdmin.report.Controller';
import { IAdminTagController } from '../core/interfaces/controllers/admin/IAdmin.Tag.Controller';
import { IAdminRewardController } from '../core/interfaces/controllers/admin/IAdmin.Reward.Controller';
const router = express.Router();

const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware);
const authController = container.get<IAuthController>(TYPES.AuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController);
const UsersController = container.get<IUsersController>(TYPES.UsersController);
const badgeController = container.get<IAdminBadgeController>(TYPES.AdminBadgeController);
const coinPlanController = container.get<IAdminCoinPlanController>(TYPES.AdminCoinPlanController);
const reportController = container.get<IAdminReportController>(TYPES.AdminReportController);
const tagController = container.get<IAdminTagController>(TYPES.AdminTagController);
const rewardController = container.get<IAdminRewardController>(TYPES.AdminRewardController);

router.post('/login', authController.loginAdmin.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/get-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),adminController.getAdminByEmail.bind(adminController));

router.get('/users',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.getAllUsers.bind(UsersController));
router.patch('/users/:userId/ban',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.banUser.bind(UsersController));
router.patch('/users/:userId/unban',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.unbanUser.bind(UsersController));

router.get('/badges',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeController.getAllBadges.bind(badgeController));
router.post('/badges',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeUpload.single('image'),badgeController.createBadge.bind(badgeController));
router.patch('/badges/:badgeId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeUpload.single('image'),badgeController.updateBadge.bind(badgeController));
router.patch('/list-badge/:badgeId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeController.listBadge.bind(badgeController));
router.patch('/unlist-badge/:badgeId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeController.unlistBadge.bind(badgeController));

router.post('/coin-plans',adminAuthMiddleware.handle.bind(adminAuthMiddleware),coinPlanController.createPlan.bind(coinPlanController));
router.get('/coin-plans',adminAuthMiddleware.handle.bind(adminAuthMiddleware),coinPlanController.getAllPlans.bind(coinPlanController));
router.patch('/coin-plans/:id',adminAuthMiddleware.handle.bind(adminAuthMiddleware),coinPlanController.updatePlan.bind(coinPlanController));
router.post('/coin-plans/:id/list',adminAuthMiddleware.handle.bind(adminAuthMiddleware),coinPlanController.listPlan.bind(coinPlanController));
router.post('/coin-plans/:id/unlist',adminAuthMiddleware.handle.bind(adminAuthMiddleware),coinPlanController.unlistPlan.bind(coinPlanController));

router.get('/reports/users',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reportController.getAllUserReports.bind(reportController));
router.patch('/reports/reject/:id',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reportController.rejectOne.bind(reportController));
router.patch('/reports/reject-all/:userId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reportController.rejectAll.bind(reportController));
router.patch('/reports/ban-user/:userId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reportController.banUserByReport.bind(reportController));

router.get('/tags',adminAuthMiddleware.handle.bind(adminAuthMiddleware),tagController.getAllTags.bind(tagController));
router.post('/tags',adminAuthMiddleware.handle.bind(adminAuthMiddleware),tagController.createTag.bind(tagController));
router.patch('/tags/:id',adminAuthMiddleware.handle.bind(adminAuthMiddleware),tagController.editTagName.bind(tagController));
router.patch('/tags/list/:id',adminAuthMiddleware.handle.bind(adminAuthMiddleware),tagController.listTag.bind(tagController));
router.patch('/tags/unlist/:id',adminAuthMiddleware.handle.bind(adminAuthMiddleware),tagController.unlistTag.bind(tagController));

router.post('/reward/add',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reward_Picture.single('image'),rewardController.createReward.bind(rewardController));
router.patch('/reward/edit/:rewardId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),reward_Picture.single('image'),rewardController.updateReward.bind(rewardController));
router.patch('/reward/list/:rewardId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),rewardController.listReward.bind(rewardController));
router.patch('/reward/unlist/:rewardId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),rewardController.unlistReward.bind(rewardController));
router.get('/reward/get-all',adminAuthMiddleware.handle.bind(adminAuthMiddleware),rewardController.getAllRewards.bind(rewardController));
router.get('/reward/get-one/:rewardId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),rewardController.getRewardById.bind(rewardController));

export default router;