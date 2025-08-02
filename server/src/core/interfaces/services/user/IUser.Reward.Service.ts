import { IOrder } from "../../../../models/Order";
import { IReward } from "../../../../models/Reward";

export interface IUserRewardService{
    findOneById(id: string): Promise<IReward | null>;
    getAllRewards(): Promise<IReward[]>;
    buyOne(rewardId:string,addressId:string,userId:string):Promise<IOrder>;
}