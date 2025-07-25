import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IOrderRepository } from "../../core/interfaces/repositories/IOrderRepository";
import { IOrder, OrderStatus } from "../../models/Order";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdmin.Order.Service";
import { HttpError } from "../../utils/HttpError";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";

@injectable()
export class AmdinOrderService implements IAdminOrderService{
    constructor(
        @inject(TYPES.OrderRepository) private orderRepo:IOrderRepository,
    ){}

    async getOnebyId(id:string): Promise<IOrder | null>{
        return await this.orderRepo.getAdminOneOrder(id);
    }

    async getAllOrders(page:number = 1, limit:number = 10):Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
        return this.orderRepo.getAllOrders(page, limit);
    }

    async changeStatus(orderId: string, newStatus: OrderStatus): Promise<IOrder | null> {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Order not found');
        }
        const currentStatus = order.status;
        if (!currentStatus) {
            throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Invalid order status');
        }
        const statusFlow: OrderStatus[] = ['pending', 'packed', 'shipped', 'delivered'];
        const currentIndex = statusFlow.indexOf(currentStatus);
        const newIndex = statusFlow.indexOf(newStatus);
        if (currentStatus === 'canceled') {
            throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Cannot update status of a canceled order');
        }
        if (newStatus === 'canceled') {
            throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Admin cannot cancel an order');
        }
        if (newIndex === -1 || newIndex <= currentIndex) {
            throw new HttpError(STATUS_CODES.BAD_REQUEST, `Cannot change status from ${currentStatus} to ${newStatus}`);
        }
        return this.orderRepo.updateStatus(orderId, newStatus);
    }


}   