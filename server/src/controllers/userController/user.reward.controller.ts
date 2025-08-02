import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRewardService } from "../../core/interfaces/services/user/IUser.Reward.Service";
import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/ResponseMessages";
import IUserRewardController from "../../core/interfaces/controllers/user/IUser.Reward.Controller";

@injectable()
export class UserRewardController implements IUserRewardController{
    constructor(
        @inject(TYPES.UserRewardService) private rewardService:IUserRewardService,
    ) {}

    async getAll(req:Request,res:Response): Promise<void> {
        const rewards = await this.rewardService.getAllRewards();
        res.status(STATUS_CODES.OK).json({rewards, message:MESSAGES.REWARD_FETCHED});
        return;
    }

    async getOne(req:Request,res:Response): Promise<void> {
        const rewardId = req.query.id
        const reward = await this.rewardService.findOneById(rewardId as string);
        console.log(reward);
        res.status(STATUS_CODES.OK).json({reward, message:MESSAGES.REWARD_FETCHED});
        return;
    }

    async buyOneReward(req:Request,res:Response):Promise<void>{
        const {rewardId,addressId} = req.body;
        const userId = req.userId;
        if(!rewardId || !addressId){
            res.status(STATUS_CODES.BAD_REQUEST).json({message:MESSAGES.INVALID_CREDENTIALS});
            return;
        }
        if(!userId){
            res.status(STATUS_CODES.UNAUTHORIZED).json({message:MESSAGES.USER_NOT_AUTHENTICATED});
            return;
        }
        const newOrder = await this.rewardService.buyOne(rewardId,addressId,userId);
        res.status(STATUS_CODES.OK).json({newOrder, message:MESSAGES.ORDER_CREATED});
        return;
    }
}