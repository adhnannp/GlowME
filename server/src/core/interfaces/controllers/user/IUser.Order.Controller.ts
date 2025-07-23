import { Request, Response } from "express";

export default interface IUserOrderController{
    getAll(req:Request,res:Response):Promise<void>;
}