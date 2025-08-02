import { Router as Router_order } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IUserAuthMiddleware } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import IUserorderController from '../../core/interfaces/controllers/user/IUser.Order.Controller';
import asyncHandler from 'express-async-handler';

const orderRoutes = Router_order();

const orderController = container.get<IUserorderController>(TYPES.UserOrderController);
const userAuthMiddleware_order = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware);
const auth_order = userAuthMiddleware_order.handle.bind(userAuthMiddleware_order);

orderRoutes.get('/order/get-all',auth_order, asyncHandler(orderController.getAll.bind(orderController)))
orderRoutes.route('/order/:orderId')
    .get(auth_order,asyncHandler(orderController.getOne.bind(orderController)))
    .put(auth_order, asyncHandler(orderController.cancelOrder.bind(orderController)));


export default orderRoutes;