import { BaseRepository } from './BaseRepository';
import { IOrderRepository } from '../core/interfaces/repositories/IOrderRepository';
import { IOrder, OrderStatus } from '../models/Order';
import { Order } from '../models/Order';
import { FilterQuery } from 'mongoose';

export class OrderRepository extends BaseRepository<IOrder> implements IOrderRepository {
  constructor() {
    super(Order);
  }

  private async paginateOrders(
    filter: FilterQuery<IOrder>,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { orders, total, page, limit };
  }

  async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
    const filter: FilterQuery<IOrder> = { user_id: userId };
    return this.paginateOrders(filter, page, limit);
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
    return this.paginateOrders({}, page, limit);
  }

  async getOneOrder(orderId: string): Promise<IOrder | null> {
    return Order.findOne({ orderId }).exec();
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ orderId }, { status }, { new: true }).exec();
  }

}
