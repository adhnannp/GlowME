import { Request, Response } from "express";

export interface IUserTagController{
    searchTag(req: Request, res: Response):Promise<void>
}