import { IOrder } from "../../../../models/Order";

export interface IUserOrderService{
    findOneById(id: string): Promise<IOrder | null>;
    getUserOrders(userId: string, page:number, limit:number): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }>;
    getOneByOrderId(orderId: string, userId: string): Promise<IOrder | null>;
    cancelOrder(orderId: string, userId: string): Promise<IOrder | null>;
}
