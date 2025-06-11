import express from 'express';
import container from '../di/container';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import { IUserController } from '../core/interfaces/controllers/user/IUserController';
import { TYPES } from '../di/types';
import { IUserAuthMiddleware } from '../core/interfaces/middlewares/IUserAuthMiddleware';
import { IUserConnectionController } from '../core/interfaces/controllers/user/IUserConnectionController';
import { IGoogleAuthController } from '../core/interfaces/controllers/auth/IGoogleAuthController';
import passport from '../config/passport';
import { IForgotPasswordcontroller } from '../core/interfaces/controllers/auth/IforgotPasswordController';
import { IUserBadgeController } from '../core/interfaces/controllers/user/IUser.Badge.Controller';
import { profile_pictureUpload, questionUploads } from '../config/multerConfig';
import IUserCoinPlanController from '../core/interfaces/controllers/user/IUser.CoinPlan.controller';
import { IUserTagController } from '../core/interfaces/controllers/user/IUser.Tag.Controller';
import { IUserQuestionController } from '../core/interfaces/controllers/user/IUser.Question.Controller';

const router = express.Router();


const userAuthMiddleware = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware);
const googleAuth = container.get<IGoogleAuthController>(TYPES.GoogleAuthController);
const authController = container.get<IAuthController>(TYPES.AuthController);
const userController = container.get<IUserController>(TYPES.UserController);
const userConnectionController = container.get<IUserConnectionController>(TYPES.UserConnectionController);
const forgotPasswordController = container.get<IForgotPasswordcontroller>(TYPES.ForgotPasswordController);
const badgeController = container.get<IUserBadgeController>(TYPES.UserBadgeController);
const coinPlanController = container.get<IUserCoinPlanController>(TYPES.UserCoinPlanController);
const tagController = container.get<IUserTagController>(TYPES.UserTagController);
const questionController = container.get<IUserQuestionController>(TYPES.UserQuestionController);

router.post('/register', authController.register.bind(authController));
router.post('/resend-otp', authController.resendOTP.bind(authController));
router.post('/login', authController.loginUser.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-user',userAuthMiddleware.handle.bind(userAuthMiddleware),authController.verifyUser.bind(authController));

router.post('/forgot-password', forgotPasswordController.forgotPassword.bind(forgotPasswordController));
router.post('/reset-password', forgotPasswordController.resetPassword.bind(forgotPasswordController));


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

router.get('/followers', userAuthMiddleware.handle.bind(userAuthMiddleware),userConnectionController.getFollowers.bind(userConnectionController));
router.get('/following', userAuthMiddleware.handle.bind(userAuthMiddleware),userConnectionController.getFollowing.bind(userConnectionController));

router.get('/badges/:userId',userAuthMiddleware.handle.bind(userAuthMiddleware),badgeController.getAvailableBadges.bind(badgeController));
router.get('/user-badges/:userId',userAuthMiddleware.handle.bind(userAuthMiddleware),badgeController.getUserBadges.bind(badgeController));
router.patch('/badges/unlock',userAuthMiddleware.handle.bind(userAuthMiddleware),badgeController.unlockBadge.bind(badgeController));
router.put('/badges/set-current',userAuthMiddleware.handle.bind(userAuthMiddleware),badgeController.setCurrentBadge.bind(badgeController));

router.get('/user/has-password',userAuthMiddleware.handle.bind(userAuthMiddleware),userController.hasPassword.bind(userController));
router.patch('/user/change-password',userAuthMiddleware.handle.bind(userAuthMiddleware),userController.changePassword.bind(userController));
router.patch('/user/update-profile',userAuthMiddleware.handle.bind(userAuthMiddleware),profile_pictureUpload.single('profile_image'),userController.updateUserProfile.bind(userController));

router.get('/Gcoin',userAuthMiddleware.handle.bind(userAuthMiddleware),coinPlanController.getCoinPlans.bind(coinPlanController));
router.post('/Gcoin/checkout',userAuthMiddleware.handle.bind(userAuthMiddleware),coinPlanController.createCoinPlanCheckoutSession.bind(coinPlanController));
router.get('/Gcoin/success/:sessionId',userAuthMiddleware.handle.bind(userAuthMiddleware),coinPlanController.getCheckoutSessionDetails.bind(coinPlanController));
router.get('/Gcoin/transaction-history',userAuthMiddleware.handle.bind(userAuthMiddleware),coinPlanController.getUserTransactionHistory.bind(coinPlanController));

router.get('/questions/search-tags',userAuthMiddleware.handle.bind(userAuthMiddleware),tagController.searchTag.bind(tagController));
router.get('/questions/check-title',userAuthMiddleware.handle.bind(userAuthMiddleware),questionController.checkTitleAvailablity.bind(questionController));
router.post('/questions/create',userAuthMiddleware.handle.bind(userAuthMiddleware),questionUploads.fields([{ name: 'image', maxCount: 1 },{ name: 'document', maxCount: 1 },]),questionController.createQuestion.bind(questionController));

export default router;