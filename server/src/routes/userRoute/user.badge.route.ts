import { Router as Router_badge } from 'express';
import container_badge from '../../di/container';
import { TYPES as TYPES_badge } from '../../di/types';
import { IUserBadgeController } from '../../core/interfaces/controllers/user/IUser.Badge.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_badge } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const badgeRouter = Router_badge();

const badgeController = container_badge.get<IUserBadgeController>(TYPES_badge.UserBadgeController);
const userAuthMiddleware_badge = container_badge.get<IUserAuthMiddleware_badge>(TYPES_badge.UserAuthMiddleware);
const auth_badge = userAuthMiddleware_badge.handle.bind(userAuthMiddleware_badge);

badgeRouter.get('/badges/:userId', auth_badge, badgeController.getAvailableBadges.bind(badgeController));
badgeRouter.get('/user-badges/:userId', auth_badge, badgeController.getUserBadges.bind(badgeController));
badgeRouter.patch('/badges/unlock', auth_badge, badgeController.unlockBadge.bind(badgeController));
badgeRouter.put('/badges/set-current', auth_badge, badgeController.setCurrentBadge.bind(badgeController));

export default badgeRouter;