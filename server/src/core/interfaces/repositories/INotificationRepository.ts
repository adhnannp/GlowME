import { INotification } from '../../../models/Notification';

export interface INotificationRepository {
  createNotification(notification: Partial<INotification>): Promise<INotification | null>;
  getUserNotifications(userId: string, skip: number,limit:number): Promise<INotification[] | null>
  markAllAsRead(userId: string): Promise<void>
  markAsRead(notificationId: string): Promise<void>;
  hasUnreadNotification(userId:string):Promise<INotification | null >
}