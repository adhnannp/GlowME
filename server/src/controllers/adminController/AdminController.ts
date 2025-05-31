import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminService } from '../../core/interfaces/services/admin/IAdminService';
import { IAdminController } from '../../core/interfaces/controllers/admin/IAdminController';
import { TYPES } from '../../di/types';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminController implements IAdminController{
    constructor(@inject(TYPES.AdminService) private adminService: IAdminService) {}

    async getAdminByEmail(req: Request, res: Response) {
        try {
            const { email } = req.query;
            if (!email || typeof email !== "string") {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.STRING_EMAIL_REQUIRED });
                return 
            }
            const user = await this.adminService.getAdminByEmail(email);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({message:MESSAGES.USER_FETCHED ,user});
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.LOGIN_FAILED, error:(error as Error).message });
        }
    }
}