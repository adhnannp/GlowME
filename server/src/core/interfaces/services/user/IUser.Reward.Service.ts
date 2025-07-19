import { IReward } from "../../../../models/Reward";

export interface IUserRewardService{
    findOneById(id: string): Promise<IReward | null>;
    getAllRewards(): Promise<IReward[]>;
}