import { Router as Router_notif } from 'express';
import container_notif from '../../di/container';
import { TYPES as TYPES_notif } from '../../di/types';
import IUserNotificationController from '../../core/interfaces/controllers/user/IUser.Notification.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_notif } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const notificationRouter = Router_notif();

const notificationController = container_notif.get<IUserNotificationController>(TYPES_notif.UserNotificationController);
const userAuthMiddleware_notif = container_notif.get<IUserAuthMiddleware_notif>(TYPES_notif.UserAuthMiddleware);
const auth_notif = userAuthMiddleware_notif.handle.bind(userAuthMiddleware_notif);

notificationRouter.get('/notification/has-unread', auth_notif, notificationController.hasUnreadNotification.bind(notificationController));
notificationRouter.get('/notification/get-all', auth_notif, notificationController.getAllNotification.bind(notificationController));
notificationRouter.patch('/notification/mark-all-read', auth_notif, notificationController.markAllRead.bind(notificationController));

export default notificationRouter;