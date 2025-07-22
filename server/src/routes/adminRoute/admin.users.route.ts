import { Router as Router_users } from 'express';
import container_users from '../../di/container';
import { TYPES } from '../../di/types';
import { IUsersController } from '../../core/interfaces/controllers/admin/IUsersController';
import { IAdminAuthMiddleware } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';

const usersRouter = Router_users();

const UsersController = container_users.get<IUsersController>(TYPES.UsersController);
const adminAuthMiddleware = container_users.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware);
const adminAuth = adminAuthMiddleware.handle.bind(adminAuthMiddleware);

usersRouter.get('/users', adminAuth, UsersController.getAllUsers.bind(UsersController));
usersRouter.patch('/users/:userId/ban', adminAuth, UsersController.banUser.bind(UsersController));
usersRouter.patch('/users/:userId/unban', adminAuth, UsersController.unbanUser.bind(UsersController));

export default usersRouter;