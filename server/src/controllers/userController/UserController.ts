import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/user/IUserService';
import { IUserController } from '../../core/interfaces/controllers/user/IUserController';
import { TYPES } from '../../di/types';

@injectable()
export class UserController implements IUserController{
    constructor(@inject(TYPES.UserService) private userService: IUserService) {}

    async getUserByEmail(req: Request, res: Response):Promise<void> {
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
            return
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error});
        }
    }

    async hasPassword(req: Request, res: Response):Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User ID not found' });
                return;
            }
            const hasPassword = await this.userService.hasPassword(userId);
            res.status(200).json({ hasPassword });
            return;
        } catch (err) {
            const error = err as Error
            res.status(400).json({ 
                message: error.message || 'Failed to check password status', 
                error 
            });
        }
    }

    async changePassword(req: Request, res: Response):Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User ID not found' });
                return;
            }
            const { current_password, new_password, googleUser } = req.body;

            if (!new_password) {
                res.status(400).json({ message: 'New password is required' });
                return;
            }

            const updatedUser = await this.userService.changePassword(
                userId,
                current_password,
                new_password,
                googleUser || false
            );
            res.status(200).json({ 
                message: 'Password changed successfully', 
                user: updatedUser 
            });
            return;
        } catch (err) {
            const error = err as Error
            res.status(400).json({ 
                message: error.message || 'Failed to change password', 
                error 
            });
        }
    }
}