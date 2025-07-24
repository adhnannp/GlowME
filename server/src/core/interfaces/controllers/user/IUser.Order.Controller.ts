import { Request, Response } from "express";

export default interface IUserOrderController{
    getAll(req:Request,res:Response):Promise<void>;
    getOne(req: Request, res: Response): Promise<void>;
    cancelOrder(req: Request, res: Response): Promise<void>;
}