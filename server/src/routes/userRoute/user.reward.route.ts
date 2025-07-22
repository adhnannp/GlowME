import { Router as Router_reward } from 'express';
import container_reward from '../../di/container';
import { TYPES as TYPES_reward } from '../../di/types';
import IUserRewardController from '../../core/interfaces/controllers/user/IUser.Reward.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_reward } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const rewardRouter = Router_reward();

const rewardController = container_reward.get<IUserRewardController>(TYPES_reward.UserRewardController);
const userAuthMiddleware_reward = container_reward.get<IUserAuthMiddleware_reward>(TYPES_reward.UserAuthMiddleware);
const auth_reward = userAuthMiddleware_reward.handle.bind(userAuthMiddleware_reward);

rewardRouter.get('/reward/get-all', auth_reward, rewardController.getAll.bind(rewardController));

export default rewardRouter;