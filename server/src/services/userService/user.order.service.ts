import { IUserOrderService } from '../../core/interfaces/services/user/IUser.Order.Service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { IOrder } from '../../models/Order';

@injectable()
export class UserOrderService implements IUserOrderService {
    constructor(
        @inject(TYPES.OrderRepository) private orderRepo: IOrderRepository,
    ) {}

    async findOneById(id: string): Promise<IOrder | null> {
        return this.orderRepo.findById(id);
    }

     async getUserOrders(userId: string, page:number = 1, limit:number = 10):Promise<IOrder[] | null> {
      const {orders} = await this.orderRepo.getUserOrders(userId, page, limit);
      return orders;
    }

    async getOneByOrderId(orderId: string, userId: string): Promise<IOrder | null> {
      const order = await this.orderRepo.getOneOrder(orderId);
      if (!order || order.user_id.toString() !== userId) return null;
      return order;
    }

    async cancelOrder(orderId: string, userId: string): Promise<IOrder | null> {
      const order = await this.getOneByOrderId(orderId, userId);
      if (!order || !order.status) throw new Error('Order not found');

      if (!['pending', 'packed', 'shipped'].includes(order.status)) {
        throw new Error('Cannot cancel this order');
      }

      // Refund logic (example: 100% or 50% based on status)
      // Handle refund in another service, not here

      return this.orderRepo.updateStatus(orderId, 'canceled');
    }

    async requestReturn(orderId: string, userId: string): Promise<IOrder | null> {
      const order = await this.getOneByOrderId(orderId, userId);
      if (!order) throw new Error('Order not found');
      if (order.status !== 'delivered') throw new Error('Only delivered orders can be returned');

      return this.orderRepo.updateStatus(orderId, 'return_requested');
    }

}
