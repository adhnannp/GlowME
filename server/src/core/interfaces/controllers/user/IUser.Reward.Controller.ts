import { Request, Response } from "express";

export default interface IUserRewardController{
    getAll(req:Request,res:Response): Promise<void>;
    getOne(req:Request,res:Response): Promise<void>;
    buyOneReward(req:Request,res:Response):Promise<void>;
}