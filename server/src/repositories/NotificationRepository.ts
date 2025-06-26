import { injectable } from 'inversify';
import { INotificationRepository } from '../core/interfaces/repositories/INotificationRepository';
import { NotificationModel, INotification } from '../models/Notification';
import { Types } from 'mongoose';

@injectable()
export class NotificationRepository implements INotificationRepository {
  async createNotification(notification: Partial<INotification>): Promise<INotification | null> {
    return await NotificationModel.create(notification);
  }

  async getUserNotifications(userId: string, skip: number = 0,limit:number = 30): Promise<INotification[] | null> {
    return await NotificationModel.find({ user: userId})
      .populate('related_user', '-password')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ user: userId, is_read: false }, { is_read: true }).exec();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await NotificationModel.updateOne({ _id: notificationId }, { is_read: true }).exec();
  }

  async hasUnreadNotification(userId:string):Promise<INotification | null > {
    return await NotificationModel.findOne({user:userId,is_read:false})
  }
}
