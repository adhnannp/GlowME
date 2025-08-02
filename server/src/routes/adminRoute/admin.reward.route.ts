import { Router as Router_reward } from 'express';
import container_reward from '../../di/container';
import { TYPES as TYPES_reward } from '../../di/types';
import { IAdminRewardController } from '../../core/interfaces/controllers/admin/IAdmin.Reward.Controller';
import { IAdminAuthMiddleware as IAdminAuthMiddleware_reward } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';
import { reward_Picture } from '../../config/multerConfig';

const rewardRouter = Router_reward();

const rewardController = container_reward.get<IAdminRewardController>(TYPES_reward.AdminRewardController);
const adminAuthMiddleware_reward = container_reward.get<IAdminAuthMiddleware_reward>(TYPES_reward.AdminAuthMiddleware);
const adminAuth_reward = adminAuthMiddleware_reward.handle.bind(adminAuthMiddleware_reward);

rewardRouter.post('/reward/add', adminAuth_reward, reward_Picture.single('image'), rewardController.createReward.bind(rewardController));
rewardRouter.patch('/reward/edit/:rewardId', adminAuth_reward, reward_Picture.single('image'), rewardController.updateReward.bind(rewardController));
rewardRouter.patch('/reward/list/:rewardId', adminAuth_reward, rewardController.listReward.bind(rewardController));
rewardRouter.patch('/reward/unlist/:rewardId', adminAuth_reward, rewardController.unlistReward.bind(rewardController));
rewardRouter.get('/reward/get-all', adminAuth_reward, rewardController.getAllRewards.bind(rewardController));
rewardRouter.get('/reward/get-one/:rewardId', adminAuth_reward, rewardController.getRewardById.bind(rewardController));

export default rewardRouter;