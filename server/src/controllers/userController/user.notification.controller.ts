import { inject, injectable } from 'inversify';
import IUserNotificationController from '../../core/interfaces/controllers/user/IUser.Notification.Controller';
import { TYPES } from '../../di/types';
import IUserNotificationService from '../../core/interfaces/services/user/IUser.Notification.Service';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { Request, Response } from 'express';

@injectable()
export class UserNotificationController implements IUserNotificationController {
    constructor(
        @inject(TYPES.UserNotificationService)
        private userNotificationService: IUserNotificationService
    ) {}

    async hasUnreadNotification(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
              res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_ID_REQUIRED });
              return;
            }
            const hasUnreadNotification = await this.userNotificationService.hasUnread(userId);
            res.status(STATUS_CODES.OK).json({ hasUnreadNotification, message: MESSAGES.HAS_UNREAD_NOTIFICATION });
            return;
        }catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json((error as Error).message);
            return;
        }
    }

    async markAllRead(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
              res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_ID_REQUIRED });
              return;
            }
            await this.userNotificationService.markAllAsRead(userId);
            res.status(STATUS_CODES.OK).json({ success:true,message: MESSAGES.MARKED_ALL_READ });
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json((error as Error).message);
            return;
        }
    }

    async getAllNotification(req: Request, res: Response): Promise<void> {
        try {
          const userId = req.userId;
          const page = parseInt(req.query.page as string) || 1;
          if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_ID_REQUIRED });
            return;
          }
          const notifications = await this.userNotificationService.getUserNotifications(userId, page);
          if (!notifications) {
            res.status(STATUS_CODES.OK).json({ notifications: [], message: MESSAGES.NO_NOTIFICATIONS });
            return;
          }
          res.status(STATUS_CODES.OK).json({
            notifications,
            message: MESSAGES.ALL_NOTIFICATION_FETCHED,
          });
        } catch (error) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message });
        }
    }

}
