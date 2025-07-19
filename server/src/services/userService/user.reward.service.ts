import { IUserRewardService } from '../../core/interfaces/services/user/IUser.Reward.Service';
import { IReward } from '../../models/Reward';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IRewardRepository } from '../../core/interfaces/repositories/IRewardRepository.js';
import { IAddressRepository } from '../../core/interfaces/repositories/IAddressRepository';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IOrder } from '../../models/Order';
import { Types } from 'mongoose';

@injectable()
export class UserRewardService implements IUserRewardService {
    constructor(
        @inject(TYPES.RewardRepository) private rewardRepo: IRewardRepository,
        @inject(TYPES.AddressRepository) private addressRepo: IAddressRepository,
        @inject(TYPES.OrderRepository) private orderRepo: IOrderRepository,
        @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    ) {}

    async findOneById(id: string): Promise<IReward | null> {
        return this.rewardRepo.findById(id);
    }

    async getAllRewards(): Promise<IReward[]> {
        return this.rewardRepo.findAll({isListed:true});
    }

    async buyOne(rewardId:string,addressId:string,userId:string):Promise<IOrder>{
        const reward = await this.findOneById(rewardId);
        if(!reward) throw new Error('reward cannot be found');
        const address = await this.addressRepo.findById(addressId);
        if(!address) throw new Error('Address cannot be found');
        const user = await this.userRepo.findById(userId);
        if(!user) throw new Error('user cannot be found');
        const addressDetails = {
            name: address.name,
            phone: address.phone,
            pincode: address.pincode,
            landmark: address.landmark,
            state: address.landmark,
            country: address.country,
            address: address.address,
        }
        const orderDetails = {
            user_id:user._id as Types.ObjectId,
            reward_id: reward._id as Types.ObjectId,
            address: addressDetails,
        }
        const order = await this.orderRepo.create(orderDetails)
        return order;
    }

}
