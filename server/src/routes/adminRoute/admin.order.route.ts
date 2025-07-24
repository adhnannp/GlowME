import { Router as Router_adminOrder } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IAdminOrderController } from '../../core/interfaces/controllers/admin/IAdmin.Order.Controller';
import { IAdminAuthMiddleware } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';

const adminOrderRoutes = Router_adminOrder();

const adminOrderController = container.get<IAdminOrderController>(TYPES.AdminOrderController);
const adminAuthMiddleware = container.get<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware);
const authAdmin = adminAuthMiddleware.handle.bind(adminAuthMiddleware);

adminOrderRoutes
  .route('/order')
  .get(authAdmin, adminOrderController.getAll.bind(adminOrderController))

adminOrderRoutes
  .route('/order/:orderId')
  .patch(authAdmin, adminOrderController.changeStatus.bind(adminOrderController))
  .get(authAdmin, adminOrderController.getOne.bind(adminOrderController))

export default adminOrderRoutes;
