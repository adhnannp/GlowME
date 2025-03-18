// src/routes/userRoutes.ts
import express from 'express';
import container from '../di/container';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/userController/user.controller';

const router = express.Router();


const authController = container.get<AuthController>('AuthController');
const userController = container.get<UserController>('UserController')

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/user',userController.getUserByEmail.bind(userController));

export default router;