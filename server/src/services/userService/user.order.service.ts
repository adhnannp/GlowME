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

    async getAllRewards(userId:string): Promise<IOrder[]> {
        return this.orderRepo.findAll({user_id:userId});
    }

}
