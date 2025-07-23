import { Router as Router_address } from 'express';
import container from '../../di/container';
import { TYPES } from '../../di/types';
import { IUserAuthMiddleware } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import IUserAddressController from '../../core/interfaces/controllers/user/IUser.Address.Controller';

const addressRouter = Router_address();

const addressController = container.get<IUserAddressController>(TYPES.UserAddressController);
const userAuthMiddleware_address = container.get<IUserAuthMiddleware>(TYPES.UserAuthMiddleware);
const auth_address = userAuthMiddleware_address.handle.bind(userAuthMiddleware_address);

addressRouter.route('/address')
    .get(auth_address, addressController.getAll.bind(addressController))
    .post(auth_address, addressController.create.bind(addressController))
    .put(auth_address, addressController.update.bind(addressController));

export default addressRouter;