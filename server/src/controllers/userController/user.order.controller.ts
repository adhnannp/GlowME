import { inject, injectable } from "inversify";
import { IUserOrderService } from "../../core/interfaces/services/user/IUser.Order.Service";
import { TYPES } from "../../di/types";
import { Request, Response } from "express";
import IUserOrderController from "../../core/interfaces/controllers/user/IUser.Order.Controller";

@injectable()
export class UserOrderController implements IUserOrderController{
    constructor(
        @inject(TYPES.UserOrderService) private orderService:IUserOrderService
    ) {}

    async getAll(req:Request,res:Response):Promise<void>{
        return;
    }
}