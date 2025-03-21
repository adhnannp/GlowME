// src/routes/adminRoutes.ts
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import container from '../di/container';

const router = express.Router();

const userController = container.get<AuthController>('AuthController');

router.post('/admin/login', userController.login);
router.post('/admin/logout', userController.logout.bind(userController));
router.post('/admin/refresh-token', userController.refreshToken.bind(userController));

export default router;