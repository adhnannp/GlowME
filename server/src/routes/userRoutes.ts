import { Router as Router_root } from 'express';

import authRoutes from './userRoute/user.auth.route';
import userRoutes_sub from './userRoute/user.user.route';
import connectionRoutes from './userRoute/user.connection.route';
import badgeRoutes from './userRoute/user.badge.route';
import coinRoutes from './userRoute/user.coinPlan.route';
import questionRoutes from './userRoute/user.question.route';
import notificationRoutes from './userRoute/user.notification.route';
import tagRoutes from './userRoute/user.tag.route';
import answerRoutes from './userRoute/user.answer.route';
import rewardRoutes from './userRoute/user.reward.route';
import orderRoutes from './userRoute/user.order.route';

const router_root = Router_root();

router_root.use(authRoutes);
router_root.use(userRoutes_sub);
router_root.use(connectionRoutes);
router_root.use(badgeRoutes);
router_root.use(coinRoutes);
router_root.use(questionRoutes);
router_root.use(notificationRoutes);
router_root.use(tagRoutes);
router_root.use(answerRoutes);
router_root.use(rewardRoutes);
router_root.use(orderRoutes);

export default router_root;
