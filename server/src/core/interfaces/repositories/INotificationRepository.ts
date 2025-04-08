import { INotification } from '../../../models/Notification';

export interface INotificationRepository {
  createNotification(notification: Partial<INotification>): Promise<INotification | null>;
  getUserNotifications(userId: string, skip?: number): Promise<INotification[] | null>;
  markAsRead(notificationId: string): Promise<void>;
}