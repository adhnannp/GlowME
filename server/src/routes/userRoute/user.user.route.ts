import { Router as Router_user } from 'express';
import container_user from '../../di/container';
import { TYPES as TYPES_user } from '../../di/types';
import { IUserController } from '../../core/interfaces/controllers/user/IUserController';
import { IUserAuthMiddleware as IUserAuthMiddleware_user } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import { profile_pictureUpload } from '../../config/multerConfig';

const userRouter = Router_user();

const userController = container_user.get<IUserController>(TYPES_user.UserController);
const userAuthMiddleware_user = container_user.get<IUserAuthMiddleware_user>(TYPES_user.UserAuthMiddleware);
const auth_user = userAuthMiddleware_user.handle.bind(userAuthMiddleware_user);

userRouter.get('/user', auth_user, userController.getUserByEmail.bind(userController));
userRouter.get('/user/has-password', auth_user, userController.hasPassword.bind(userController));
userRouter.patch('/user/change-password', auth_user, userController.changePassword.bind(userController));
userRouter.patch(
  '/user/update-profile',
  auth_user,
  profile_pictureUpload.single('profile_image'),
  userController.updateUserProfile.bind(userController)
);

export default userRouter;