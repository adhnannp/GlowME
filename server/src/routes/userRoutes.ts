import express from 'express';
import container from '../di/container';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import { IUserController } from '../core/interfaces/controllers/user/IUserController';
import { TYPES } from '../di/types';
import { IUserAuthMiddleware } from '../core/interfaces/middlewares/IUserAuthMiddleware';
import { IUserConnectionController } from '../core/interfaces/controllers/user/IUserConnectionController';
import { IGoogleAuthController } from '../core/interfaces/controllers/auth/IGoogleAuthController';
import passport from '../config/passport';

const router = express.Router();


const userAuthMiddleware = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware)
const googleAuth = container.get<IGoogleAuthController>(TYPES.GoogleAuthController)
const authController = container.get<IAuthController>(TYPES.AuthController);
const userController = container.get<IUserController>(TYPES.UserController)
const userConnectionController = container.get<IUserConnectionController>(TYPES.UserConnectionController);


router.post('/register', authController.register.bind(authController));
router.post('/resend-otp', authController.resendOTP.bind(authController));
router.post('/login', authController.loginUser.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-user',userAuthMiddleware.handle.bind(userAuthMiddleware),authController.verifyUser.bind(authController));

router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureMessage: true }),googleAuth.handleGoogleCallback.bind(googleAuth));

router.get('/user',userAuthMiddleware.handle.bind(userAuthMiddleware),userController.getUserByEmail.bind(userController));
router.post('/follow', userAuthMiddleware.handle.bind(userAuthMiddleware), userConnectionController.followUser.bind(userConnectionController));
router.post('/unfollow', userAuthMiddleware.handle.bind(userAuthMiddleware), userConnectionController.unfollowUser.bind(userConnectionController));
router.post('/report', userAuthMiddleware.handle.bind(userAuthMiddleware), userConnectionController.reportUser.bind(userConnectionController));
router.get('/users', userAuthMiddleware.handle.bind(userAuthMiddleware), userConnectionController.getUsers.bind(userConnectionController));
router.get('/users/:id',userAuthMiddleware.handle.bind(userAuthMiddleware), userConnectionController.getUserById.bind(userConnectionController));

export default router;