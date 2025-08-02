import { Router as Router_reward } from 'express';
import container_reward from '../../di/container';
import { TYPES as TYPES_reward } from '../../di/types';
import IUserRewardController from '../../core/interfaces/controllers/user/IUser.Reward.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_reward } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import asyncHandler from 'express-async-handler';

const rewardRouter = Router_reward();

const rewardController = container_reward.get<IUserRewardController>(TYPES_reward.UserRewardController);
const userAuthMiddleware_reward = container_reward.get<IUserAuthMiddleware_reward>(TYPES_reward.UserAuthMiddleware);
const auth_reward = userAuthMiddleware_reward.handle.bind(userAuthMiddleware_reward);

rewardRouter.get('/reward/get-one', auth_reward, asyncHandler(rewardController.getOne.bind(rewardController)));
rewardRouter.route('/reward')
    .get(auth_reward, asyncHandler(rewardController.getAll.bind(rewardController)))
    .post(auth_reward, asyncHandler(rewardController.buyOneReward.bind(rewardController)));

export default rewardRouter;