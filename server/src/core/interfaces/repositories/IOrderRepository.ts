import { IBaseRepository } from "./IBaseRepository";
import { IOrder, OrderStatus } from '../../../models/Order';

export interface IOrderRepository extends IBaseRepository<IOrder> {
    getUserOrders(userId: string,page: number,limit: number): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }>
    getAllOrders(page: number,limit: number): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }>
    getOneOrder(orderId: string): Promise<IOrder | null>
    updateStatus(orderId: string, status: OrderStatus): Promise<IOrder | null>
}
