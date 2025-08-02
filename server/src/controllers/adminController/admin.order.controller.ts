import { inject, injectable } from "inversify";
import { IAdminOrderController } from "../../core/interfaces/controllers/admin/IAdmin.Order.Controller";
import { TYPES } from "../../di/types";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdmin.Order.Service";
import { Request, Response } from "express";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";

@injectable()
export class AdminOrderController implements IAdminOrderController {
    constructor(
        @inject(TYPES.AdminOrderService) private orderService: IAdminOrderService,
    ) {}

    async getAll(req: Request, res: Response): Promise<void> {
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
        const result = await this.orderService.getAllOrders(page, limit);
        res.status(STATUS_CODES.OK).json({...result,message:MESSAGES.ADMIN_ORDER_FETCHED});
    }

    async changeStatus(req: Request, res: Response): Promise<void> {
        const orderId = req.params.orderId;
        const newStatus = req.body.status;
        const updatedOrder = await this.orderService.changeStatus(orderId, newStatus);
        res.status(STATUS_CODES.OK).json({ message: MESSAGES.ORDER_STATUS_UPDATED, order: updatedOrder });
    }

    async getOne(req: Request, res: Response): Promise<void> {
        const orderId = req.params.orderId;
        const order = await this.orderService.getOnebyId(orderId);
        res.status(STATUS_CODES.OK).json({order,message:MESSAGES.ORDER_FETCHED});
    }
}
