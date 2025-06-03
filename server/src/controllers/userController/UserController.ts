import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/user/IUserService';
import { IUserController } from '../../core/interfaces/controllers/user/IUserController';
import { TYPES } from '../../di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';

@injectable()
export class UserController implements IUserController{
    constructor(@inject(TYPES.UserService) private userService: IUserService) {}

    async getUserByEmail(req: Request, res: Response):Promise<void> {
        try {
            const { email } = req.query;
            console.log(email)
            if (!email || typeof email !== "string") {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.STRING_EMAIL_REQUIRED });
                return 
            }
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({message: MESSAGES.USER_FETCHED ,user});
            return
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.INTERNAL_SERVER_ERROR , error});
        }
    }

    async hasPassword(req: Request, res: Response):Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED_USER_ID });
                return;
            }
            const hasPassword = await this.userService.hasPassword(userId);
            res.status(STATUS_CODES.OK).json({ hasPassword });
            return;
        } catch (err) {
            const error = err as Error
            res.status(STATUS_CODES.BAD_REQUEST).json({ 
                message: error.message || MESSAGES.FAILED_CHECKING_PASSWORD_STATUS, 
                error 
            });
        }
    }

    async changePassword(req: Request, res: Response):Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED_USER_ID });
                return;
            }
            const { current_password, new_password, googleUser } = req.body;

            if (!new_password) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.NEW_PASSWORD_REQUIRED });
                return;
            }

            const updatedUser = await this.userService.changePassword(
                userId,
                current_password,
                new_password,
                googleUser || false
            );
            res.status(STATUS_CODES.OK).json({ 
                message: MESSAGES.PASSWORD_CHANGED, 
                user: updatedUser 
            });
            return;
        } catch (err) {
            const error = err as Error
            res.status(STATUS_CODES.BAD_REQUEST).json({ 
                message: error.message || MESSAGES.PASSWORD_CHANGE_FAILED, 
                error 
            });
        }
    }

    async updateUserProfile(req: Request, res: Response):Promise<void> {
        try {
          const userId = req.userId;
          if (!userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED_USER_ID });
            return 
          }
          const { username } = req.body;
          const profile_image = req.file;
          if (!username) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NAME_REQUIRED });
            return 
          }
          const updatedUser = await this.userService.updateUserProfile(userId, {
            username,
            profile_image: profile_image || null,
          });
          res.status(STATUS_CODES.OK).json({
              message: MESSAGES.PROFILE_UPDATED_SUCCESS,
              user: updatedUser,
            });
          return 
        } catch (error) {
          const err = error as Error;
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message || MESSAGES.PROFILE_UPDATED_FAILED });
          return 
        }
    }

}