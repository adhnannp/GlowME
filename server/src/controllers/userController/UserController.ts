import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/user/IUserService';
import { IUserController } from '../../core/interfaces/controllers/user/IUserController';
import { TYPES } from '../../di/types';

@injectable()
export class UserController implements IUserController{
    constructor(@inject(TYPES.UserService) private userService: IUserService) {}

    async getUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.query;
            console.log(email)
            if (!email || typeof email !== "string") {
                res.status(400).json({ message: "Email is required and must be a string" });
                return 
            }
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return
            }
            res.status(200).json({message:"user fetched successsfully",user});
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error});
        }
    }
}