import { Request, Response } from "express";

export default interface IUserRewardController{
    getAll(req:Request,res:Response): Promise<void>;
}