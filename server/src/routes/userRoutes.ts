import express from 'express';
import container from '../di/container';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { IUserController } from '../core/interfaces/controllers/IUserController';
import { TYPES } from '../di/types';
import verifyToken from '../middleware/UserAuthMiddleware';
import { IUserAuthMiddleware } from '../core/interfaces/middlewares/IUserAuthMiddleware';

const router = express.Router();


const authController = container.get<IAuthController>(TYPES.AuthController);
const userController = container.get<IUserController>(TYPES.UserController)
const userAuthMiddleware = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware)

router.post('/register', authController.register.bind(authController));
router.post('/resend-otp', authController.resendOTP.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-user',userAuthMiddleware.handle.bind(userAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/user',userAuthMiddleware.handle.bind(userAuthMiddleware),userController.getUserByEmail.bind(userController));

export default router;