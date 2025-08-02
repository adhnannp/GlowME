import { Router as Router_conn } from 'express';
import container_conn from '../../di/container';
import { TYPES as TYPES_conn } from '../../di/types';
import { IUserConnectionController } from '../../core/interfaces/controllers/user/IUserConnectionController';
import { IUserAuthMiddleware as IUserAuthMiddleware_conn } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const connectionRouter = Router_conn();

const userConnectionController = container_conn.get<IUserConnectionController>(TYPES_conn.UserConnectionController);
const userAuthMiddleware_conn = container_conn.get<IUserAuthMiddleware_conn>(TYPES_conn.UserAuthMiddleware);
const auth_conn = userAuthMiddleware_conn.handle.bind(userAuthMiddleware_conn);

connectionRouter.post('/follow', auth_conn, userConnectionController.followUser.bind(userConnectionController));
connectionRouter.post('/unfollow', auth_conn, userConnectionController.unfollowUser.bind(userConnectionController));
connectionRouter.post('/report', auth_conn, userConnectionController.reportUser.bind(userConnectionController));
connectionRouter.get('/users', auth_conn, userConnectionController.getUsers.bind(userConnectionController));
connectionRouter.get('/users/:id', auth_conn, userConnectionController.getUserById.bind(userConnectionController));
connectionRouter.get('/followers', auth_conn, userConnectionController.getFollowers.bind(userConnectionController));
connectionRouter.get('/following', auth_conn, userConnectionController.getFollowing.bind(userConnectionController));

export default connectionRouter;