import { Request, Response } from "express";

export interface IAdminOrderController{
    getAll(req: Request, res: Response): Promise<void>;
    changeStatus(req: Request, res: Response): Promise<void>;
    getOne(req: Request, res: Response): Promise<void>
}