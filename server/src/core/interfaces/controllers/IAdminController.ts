import {Request,Response} from 'express'

export interface IAdminController{
    getAdminByEmail(req:Request,res:Response):Promise<void>;
}