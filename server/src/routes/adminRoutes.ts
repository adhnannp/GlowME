import express from 'express';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import container from '../di/container';
import { TYPES } from '../di/types';
import { IAdminController } from '../core/interfaces/controllers/admin/IAdminController';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
import { IUsersController } from '../core/interfaces/controllers/admin/IUsersController';
const router = express.Router();

const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware)
const authController = container.get<IAuthController>(TYPES.AuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController);
const UsersController = container.get<IUsersController>(TYPES.UsersController);

router.post('/login', authController.loginAdmin.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/get-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),adminController.getAdminByEmail.bind(adminController));

router.get('/users',adminAuthMiddleware.handle.bind(adminAuthMiddleware),UsersController.getAllUsers.bind(UsersController))
export default router;