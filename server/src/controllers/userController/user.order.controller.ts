import { inject, injectable } from "inversify";
import { IUserOrderService } from "../../core/interfaces/services/user/IUser.Order.Service";
import { TYPES } from "../../di/types";
import { Request, Response } from "express";
import IUserOrderController from "../../core/interfaces/controllers/user/IUser.Order.Controller";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class UserOrderController implements IUserOrderController{
    constructor(
        @inject(TYPES.UserOrderService) private orderService:IUserOrderService
    ) {}

    async getAll(req: Request, res: Response): Promise<void> {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (page<1) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_PAGE_NUMBER });
            return;
        }
        if (limit<1) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_PAGE_LIMIT });
            return;
        }
        const orders = await this.orderService.getUserOrders(userId, page, limit);
        res.status(STATUS_CODES.OK).json({...orders,message:MESSAGES.USER_ORDER_FETCHED});
    }

    async getOne(req: Request, res: Response): Promise<void> {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
            return;
        }
        const orderId = req.params.orderId;
        const order = await this.orderService.getOneByOrderId(orderId, userId);
        res.status(STATUS_CODES.OK).json({order,message:MESSAGES.ORDER_FETCHED});
    }

    async cancelOrder(req: Request, res: Response): Promise<void> {
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
            return;
        }
        const orderId = req.params.orderId;
        const updatedOrder = await this.orderService.cancelOrder(orderId, userId);
        res.status(STATUS_CODES.OK).json({updatedOrder,message:MESSAGES.ORDER_CANCELED});
    }
}