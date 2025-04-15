import express from 'express';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import container from '../di/container';
import { TYPES } from '../di/types';
import { IAdminController } from '../core/interfaces/controllers/admin/IAdminController';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
import { IUsersController } from '../core/interfaces/controllers/admin/IUsersController';
import { IAdminBadgeController } from '../core/interfaces/controllers/admin/IAdmin.Badge.Controller';
import { badgeUpload } from '../config/multerConfig';
const router = express.Router();

const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware)
const authController = container.get<IAuthController>(TYPES.AuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController);
const UsersController = container.get<IUsersController>(TYPES.UsersController);
const badgeController = container.get<IAdminBadgeController>(TYPES.AdminBadgeController);

router.post('/login', authController.loginAdmin.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/get-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),adminController.getAdminByEmail.bind(adminController));

router.get('/users',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.getAllUsers.bind(UsersController))
router.patch('/users/:userId/ban',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.banUser.bind(UsersController))
router.patch('/users/:userId/unban',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.unbanUser.bind(UsersController))
router.get('/badges',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeController.getAllBadges.bind(badgeController))
router.post('/badges',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeUpload.single('image'),badgeController.createBadge.bind(badgeController));
router.patch('/badges/:badgeId',adminAuthMiddleware.handle.bind(adminAuthMiddleware),badgeUpload.single('image'),badgeController.updateBadge.bind(badgeController));

export default router;