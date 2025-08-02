import { Router as Router_coin } from 'express';
import container_coin from '../../di/container';
import { TYPES as TYPES_coin } from '../../di/types';
import IAdminCoinPlanController from '../../core/interfaces/controllers/admin/IAdmin.CoinPlan.Controller';
import { IAdminAuthMiddleware as IAdminAuthMiddleware_coin } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';

const coinRouter = Router_coin();

const coinPlanController = container_coin.get<IAdminCoinPlanController>(TYPES_coin.AdminCoinPlanController);
const adminAuthMiddleware_coin = container_coin.get<IAdminAuthMiddleware_coin>(TYPES_coin.AdminAuthMiddleware);
const adminAuth_coin = adminAuthMiddleware_coin.handle.bind(adminAuthMiddleware_coin);

coinRouter.post('/coin-plans', adminAuth_coin, coinPlanController.createPlan.bind(coinPlanController));
coinRouter.get('/coin-plans', adminAuth_coin, coinPlanController.getAllPlans.bind(coinPlanController));
coinRouter.patch('/coin-plans/:id', adminAuth_coin, coinPlanController.updatePlan.bind(coinPlanController));
coinRouter.post('/coin-plans/:id/list', adminAuth_coin, coinPlanController.listPlan.bind(coinPlanController));
coinRouter.post('/coin-plans/:id/unlist', adminAuth_coin, coinPlanController.unlistPlan.bind(coinPlanController));

export default coinRouter;
