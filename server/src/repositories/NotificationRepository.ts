import { injectable } from 'inversify';
import { INotificationRepository } from '../core/interfaces/repositories/INotificationRepository';
import { NotificationModel, INotification } from '../models/Notification';
import { Types } from 'mongoose';

@injectable()
export class NotificationRepository implements INotificationRepository {
  async createNotification(notification: Partial<INotification>): Promise<INotification | null> {
    return await NotificationModel.create(notification);
  }

  async getUserNotifications(userId: string, skip: number = 0): Promise<INotification[] | null> {
    return await NotificationModel.find({ user: userId})
      .populate('related_user', 'username profile_image')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(10)
      .lean()
      .exec();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await NotificationModel.updateOne({ _id: notificationId }, { is_read: true }).exec();
  }
}
