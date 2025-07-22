import { Router } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IAuthController } from '../../core/interfaces/controllers/auth/IAuthController';
import { IGoogleAuthController } from '../../core/interfaces/controllers/auth/IGoogleAuthController';
import { IForgotPasswordcontroller } from '../../core/interfaces/controllers/auth/IforgotPasswordController';
import passport from '../../config/passport';
import { IUserAuthMiddleware } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);
const googleAuth = container.get<IGoogleAuthController>(TYPES.GoogleAuthController);
const forgotPasswordController = container.get<IForgotPasswordcontroller>(TYPES.ForgotPasswordController);
const userAuthMiddleware = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware);
const auth_user = userAuthMiddleware.handle.bind(userAuthMiddleware);

router.post('/register', authController.register.bind(authController));
router.post('/resend-otp', authController.resendOTP.bind(authController));
router.post('/login', authController.loginUser.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-user',auth_user,authController.verifyUser.bind(authController));

router.post('/forgot-password', forgotPasswordController.forgotPassword.bind(forgotPasswordController));
router.post('/reset-password', forgotPasswordController.resetPassword.bind(forgotPasswordController));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureMessage: true }),
  googleAuth.handleGoogleCallback.bind(googleAuth)
);

export default router;
