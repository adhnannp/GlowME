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
        try {
            const rewards = await this.rewardService.getAllRewards();
            res.status(STATUS_CODES.OK).json({rewards, message:MESSAGES.REWARD_FETCHED});
            return;
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:(error as Error).message});
            return;
        }
    }

    async getOne(req:Request,res:Response): Promise<void> {
        try {
            const rewardId = req.params.id
            const reward = await this.rewardService.findOneById(rewardId);
            res.status(STATUS_CODES.OK).json({reward, message:MESSAGES.REWARD_FETCHED});
            return;
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:(error as Error).message});
            return;
        }
    }
}