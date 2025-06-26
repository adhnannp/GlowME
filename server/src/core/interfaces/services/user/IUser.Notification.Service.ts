import { INotification } from "../../../../models/Notification";

export default interface IUserNotificationService{
    createAndEmitNotification(userId: string, type: string, message: string, relatedUserId?: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<void>;
    hasUnread(userId:string) :Promise<boolean>;
    getUserNotifications(userId: string, page: number): Promise<INotification[] | null>;
}