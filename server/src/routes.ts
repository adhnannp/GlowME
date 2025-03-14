import express from 'express';
import { AuthController } from './controllers/authController';

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));

export default router;