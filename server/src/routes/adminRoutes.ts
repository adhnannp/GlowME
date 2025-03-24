// src/routes/adminRoutes.ts
// import express from 'express';
// import { IAuthController } from '../core/interfaces/controllers/IAuthController';
// import container from '../di/container';
// import { TYPES } from '../di/types';

// const router = express.Router();

// const userController = container.get<IAuthController>(TYPES.AuthController);

// router.post('/admin/login', userController.login);
// router.post('/admin/logout', userController.logout.bind(userController));
// router.post('/admin/refresh-token', userController.refreshToken.bind(userController));

// export default router;