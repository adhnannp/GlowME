import { IOrder, OrderStatus } from "../../../../models/Order";

export interface IAdminOrderService{
    getOnebyId(id:string): Promise<IOrder | null>
    getAllOrders(page:number, limit:number):Promise<{ orders: IOrder[]; total: number; page: number; limit: number }>;
    changeStatus(orderId: string, status: OrderStatus): Promise<IOrder | null>;
}