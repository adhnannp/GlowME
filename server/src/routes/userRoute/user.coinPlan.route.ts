import { Router as Router_coin } from 'express';
import container_coin from '../../di/container';
import { TYPES as TYPES_coin } from '../../di/types';
import IUserCoinPlanController from '../../core/interfaces/controllers/user/IUser.CoinPlan.controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_coin } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const coinRouter = Router_coin();

const coinPlanController = container_coin.get<IUserCoinPlanController>(TYPES_coin.UserCoinPlanController);
const userAuthMiddleware_coin = container_coin.get<IUserAuthMiddleware_coin>(TYPES_coin.UserAuthMiddleware);
const auth_coin = userAuthMiddleware_coin.handle.bind(userAuthMiddleware_coin);

coinRouter.get('/Gcoin', auth_coin, coinPlanController.getCoinPlans.bind(coinPlanController));
coinRouter.post('/Gcoin/checkout', auth_coin, coinPlanController.createCoinPlanCheckoutSession.bind(coinPlanController));
coinRouter.get('/Gcoin/success/:sessionId', auth_coin, coinPlanController.getCheckoutSessionDetails.bind(coinPlanController));
coinRouter.get('/Gcoin/transaction-history', auth_coin, coinPlanController.getUserTransactionHistory.bind(coinPlanController));

export default coinRouter;