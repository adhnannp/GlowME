import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminService } from '../../core/interfaces/services/IAdminService';
import { IAdminController } from '../../core/interfaces/controllers/IAdminController';
import { TYPES } from '../../di/types';

@injectable()
export class AdminController implements IAdminController{
    constructor(@inject(TYPES.AdminService) private adminService: IAdminService) {}

    async getAdminByEmail(req: Request, res: Response) {
        try {
            const { email } = req.query;
            console.log(email)
            if (!email || typeof email !== "string") {
                res.status(400).json({ message: "Email is required and must be a string" });
                return 
            }
            const user = await this.adminService.getAdminByEmail(email);
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