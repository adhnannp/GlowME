import { Request, Response } from "express";

export interface IUserQuestionController {
    checkTitleAvailablity(req:Request,res:Response):Promise<void>;
}