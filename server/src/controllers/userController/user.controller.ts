import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/IUserService';

@injectable()
export class UserController {
    constructor(@inject('IUserService') private userService: IUserService) {}

    async getUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error});
        }
    }
}