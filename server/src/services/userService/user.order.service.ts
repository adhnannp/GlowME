import { IUserOrderService } from '../../core/interfaces/services/user/IUser.Order.Service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { IOrder } from '../../models/Order';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { HttpError } from '../../utils/HttpError';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import ICoinTransactionRepository from '../../core/interfaces/repositories/ICoinTransactionRepository';
import { CoinTransactionCreateInput } from '../../core/types/CreateCoinTransaction';
import mongoose from 'mongoose';

@injectable()
export class UserOrderService implements IUserOrderService {
    constructor(
        @inject(TYPES.OrderRepository) private orderRepo: IOrderRepository,
        @inject(TYPES.UserRepository) private userRepo: IUserRepository,
        @inject(TYPES.CoinTransactionRepository) private transactionRepo: ICoinTransactionRepository,
    ) {}

    async findOneById(id: string): Promise<IOrder | null> {
        return this.orderRepo.findById(id);
    }

    async getUserOrders(userId: string, page:number = 1, limit:number = 10):Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
        return await this.orderRepo.getUserOrders(userId, page, limit);
    }

    async getOneByOrderId(orderId: string, userId: string): Promise<IOrder | null> {
      const order = await this.orderRepo.getOneOrder(orderId);
      if (!order || order.user_id.toString() !== userId){
        throw new HttpError(STATUS_CODES.BAD_REQUEST,'No order found');
      }
      return order;
    }

    async cancelOrder(orderId: string, userId: string): Promise<IOrder | null> {
      const order = await this.getOneByOrderId(orderId, userId);
      if (!order || !order.status) throw new Error('Order not found');

      if (['delivered','canceled'].includes(order.status)) {
        throw new HttpError(STATUS_CODES.BAD_REQUEST,'Order cannot be canceled');
      }
      if(order.status == 'shipped'){
        const ProductCoin = order.paid_coin;
        const ProductCoin_half = Math.floor(ProductCoin);
        await this.userRepo.incrementCoin(userId,ProductCoin_half);
        const updated_order =  this.orderRepo.updateStatus(orderId, 'canceled');
        const coin_transaction:CoinTransactionCreateInput = {
          amount:0,
          coins:ProductCoin_half,
          userId: new mongoose.Types.ObjectId(userId),
          type:'refund',
        }
        await this.transactionRepo.create(coin_transaction);
        return updated_order
      }
      return this.orderRepo.updateStatus(orderId, 'canceled');
    }

}
