import { Router as Router_root } from 'express';

import authRoutes from './adminRoute/admin.auth.route';
import usersRoutes from './adminRoute/admin.users.route';
import badgeRoutes from './adminRoute/admin.badge.route';
import coinRoutes from './adminRoute/admin.coinPlan.route';
import reportRoutes from './adminRoute/admin.report.route';
import tagRoutes from './adminRoute/admin.tag.route';
import rewardRoutes from './adminRoute/admin.reward.route';

const router_root = Router_root();

router_root.use(authRoutes);
router_root.use(usersRoutes);
router_root.use(badgeRoutes);
router_root.use(coinRoutes);
router_root.use(reportRoutes);
router_root.use(tagRoutes);
router_root.use(rewardRoutes);

export default router_root;