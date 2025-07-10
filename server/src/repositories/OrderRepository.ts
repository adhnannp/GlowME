import { BaseRepository } from './BaseRepository';
import { IOrderRepository } from '../core/interfaces/repositories/IOrderRepository';
import { IOrder } from '../models/Order';
import { Order } from '../models/Order';

export class OrderRepository extends BaseRepository<IOrder> implements IOrderRepository {
  constructor() {
    super(Order);
  }

}
