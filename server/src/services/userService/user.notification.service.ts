import { injectable, inject } from 'inversify';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { INotification, NotificationType } from '../../models/Notification';
import { TYPES } from '../../di/types';
import IUserNotificationService from '../../core/interfaces/services/user/IUser.Notification.Service';
import IUserSocketController from '../../core/interfaces/controllers/user/IUser.Socket.Controller';

@injectable()
export class UserNotificationService implements IUserNotificationService{
  constructor(
    @inject(TYPES.NotificationRepository) private notificationRepo: INotificationRepository,
    @inject(TYPES.UserSocketController) private socketController: IUserSocketController
  ) {}

  async createAndEmitNotification(userId: string, type: NotificationType, message: string, relatedUserId?: string): Promise<INotification | null> {
    const notification = await this.notificationRepo.createNotification({
      user: userId,
      type,
      message,
      related_user: relatedUserId,
      is_read: false,
    });

    if (notification) {
      await notification.populate({  path: 'related_user',select: '-password'});
      this.socketController.emitNotification(userId as string, notification);
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }

  async hasUnread(userId:string) :Promise<boolean>{
    const unread = await this.notificationRepo.hasUnreadNotification(userId);
    if(unread){
      return true
    }
    return false;
  }

  async getUserNotifications(userId: string, page: number): Promise<INotification[] | null> {
    const limit = 30;
    const skip = (page - 1) * limit;
    return await this.notificationRepo.getUserNotifications(userId, skip, limit);
  }

}