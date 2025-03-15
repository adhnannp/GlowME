// src/routes/userRoutes.ts
import express from 'express';
import container from '../di/container';
import { UserController } from '../controllers/UserController';

const router = express.Router();


const userController = container.get<UserController>('UserController');

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/verify-otp', userController.verifyOTP.bind(userController));
router.post('/logout', userController.logout.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController));

export default router;