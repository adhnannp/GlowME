import { Request, Response } from 'express';

export interface IAdminTagController{
    getAllTags(req: Request, res: Response): Promise<void>;
    createTag(req: Request, res: Response): Promise<void>;
    editTagName(req: Request, res: Response): Promise<void>;
    listTag(req: Request, res: Response): Promise<void>;
    unlistTag(req: Request, res: Response): Promise<void>;
}