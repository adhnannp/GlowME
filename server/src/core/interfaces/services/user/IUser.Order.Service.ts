import { IOrder } from "../../../../models/Order";

export interface IUserOrderService{
    findOneById(id: string): Promise<IOrder | null>;
    getAllRewards(userId:string): Promise<IOrder[]>;
}