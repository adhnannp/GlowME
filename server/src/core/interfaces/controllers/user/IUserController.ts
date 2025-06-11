import {Request,Response} from 'express';

export interface IUserController{
    getUserByEmail(req:Request,res:Response):Promise<void>;
    hasPassword(req: Request, res: Response):Promise<void>;
    changePassword(req: Request, res: Response):Promise<void>;
    updateUserProfile(req: Request, res: Response):Promise<void>;
}