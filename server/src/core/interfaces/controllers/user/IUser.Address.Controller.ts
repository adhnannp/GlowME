import { Request, Response } from "express";

export default interface IUserAddressController{
    getAll(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
}