// src/routes/adminRoutes.ts
import express from 'express';
import { UserController } from '../controllers/UserController';
import container from '../di/container';

const router = express.Router();

const userController = container.get<UserController>('UserController');

router.post('/admin/login', userController.login);

export default router;