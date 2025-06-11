import { Request, Response } from 'express';

export interface IForgotPasswordcontroller {
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
}