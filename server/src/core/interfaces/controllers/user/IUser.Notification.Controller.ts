import { Request, Response } from "express";

export default interface IUserNotificationController{
    hasUnreadNotification(req: Request, res: Response): Promise<void>;
    markAllRead(req: Request, res: Response): Promise<void>;
    getAllNotification(req: Request, res: Response): Promise<void>
}