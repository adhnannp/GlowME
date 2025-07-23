import { Router as Router_order } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IUserAuthMiddleware } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import IUserorderController from '../../core/interfaces/controllers/user/IUser.Order.Controller';

const orderRouter = Router_order();

const orderController = container.get<IUserorderController>(TYPES.UserOrderController);
const userAuthMiddleware_order = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware);
const auth_order = userAuthMiddleware_order.handle.bind(userAuthMiddleware_order);

orderRouter.route('/order')
    .get(auth_order, orderController.getAll.bind(orderController))

export default orderRouter;