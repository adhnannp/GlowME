import express from 'express';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import container from '../di/container';
import { TYPES } from '../di/types';
import verifyToken from '../middleware/UserAuthMiddleware';
import { IAdminController } from '../core/interfaces/controllers/IAdminController';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
const router = express.Router();

const authController = container.get<IAuthController>(TYPES.AuthController);
const adminController = container.get<IAdminController>(TYPES.AdminController);
const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware)

router.post('/login', authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/get-admin',adminAuthMiddleware.handle.bind(adminAuthMiddleware),adminController.getAdminByEmail.bind(adminController));
export default router;