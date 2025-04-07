import { Container } from 'inversify';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/auth/AuthService';
import { OTPService } from '../services/auth/OTPService';
import { UserService } from '../services/userService/UserService';
import { UserController } from '../controllers/userController/UserController';
import { AuthController } from '../controllers/auth/AuthController';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IAuthService } from '../core/interfaces/services/auth/IAuthService';
import { IOTPService } from '../core/interfaces/services/auth/IOTPService';
import { IUserService } from '../core/interfaces/services/user/IUserService';
import { IAuthController } from '../core/interfaces/controllers/auth/IAuthController';
import { TYPES } from '../di/types';
import { IUserController } from '../core/interfaces/controllers/user/IUserController';
import { IAdminService } from '../core/interfaces/services/admin/IAdminService';
import { AdminService } from '../services/adminService/AdminService';
import { IAdminController } from '../core/interfaces/controllers/admin/IAdminController';
import { AdminController } from '../controllers/adminController/AdminController';
import { IUserAuthMiddleware } from '../core/interfaces/middlewares/IUserAuthMiddleware';
import UserAuthMiddleware from '../middleware/UserAuthMiddleware';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
import AdminAuthMiddleware from '../middleware/AdminAuthMiddleware';
import { IUsersService } from '../core/interfaces/services/admin/IUsersService';
import UsersService from '../services/adminService/users.service';
import { IUsersController } from '../core/interfaces/controllers/admin/IUsersController';
import { UsersController } from '../controllers/adminController/users.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IUsersService>(TYPES.UsersService).to(UsersService)

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController)

//mmiddleware
container.bind<IUserAuthMiddleware>(TYPES.UserAuthMiddleware).to(UserAuthMiddleware);
container.bind<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware).to(AdminAuthMiddleware);

export default container;
