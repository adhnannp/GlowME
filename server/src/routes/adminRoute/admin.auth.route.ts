import { Router } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IAuthController } from '../../core/interfaces/controllers/auth/IAuthController';
import { IAdminAuthMiddleware } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';
import { IAdminController } from '../../core/interfaces/controllers/admin/IAdminController';

const authRouter = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController);
const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware);
const adminAuth = adminAuthMiddleware.handle.bind(adminAuthMiddleware);

authRouter.post('/login', authController.loginAdmin.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));

authRouter.get('/verify-admin', adminAuth, authController.verifyUser.bind(authController));

authRouter.get('/get-admin', adminAuth, adminController.getAdminByEmail.bind(adminController));

export default authRouter;
