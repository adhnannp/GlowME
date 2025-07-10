import { IBaseRepository } from "./IBaseRepository";
import { IOrder } from '../../../models/Order';

export interface IOrderRepository extends IBaseRepository<IOrder> {
}
