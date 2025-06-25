import { INotification } from "../../../../models/Notification";

export default interface IUserNotificationService{
    createAndEmitNotification(userId: string, type: string, message: string, relatedUserId?: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<void>;
}