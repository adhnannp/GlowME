import { Container } from 'inversify';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/auth/AuthService';
import { OTPService } from '../services/auth/OTPService';
import { UserService } from '../services/userService/UserService';
import { UserController } from '../controllers/userController/UserController';
import { AuthController } from '../controllers/AuthController';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IAuthService } from '../core/interfaces/services/IAuthService';
import { IOTPService } from '../core/interfaces/services/IOTPService';
import { IUserService } from '../core/interfaces/services/IUserService';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { TYPES } from '../di/types';
import { IUserController } from '../core/interfaces/controllers/IUserController';
import { IAdminService } from '../core/interfaces/services/IAdminService';
import { AdminService } from '../services/adminService/AdminService';
import { IAdminController } from '../core/interfaces/controllers/IAdminController';
import { AdminController } from '../controllers/adminController/AdminController';
import { IUserAuthMiddleware } from '../core/interfaces/middlewares/IUserAuthMiddleware';
import UserAuthMiddleware from '../middleware/UserAuthMiddleware';
import { IAdminAuthMiddleware } from '../core/interfaces/middlewares/IAdminAuthMiddleware';
import AdminAuthMiddleware from '../middleware/AdminAuthMiddleware';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService)

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

//mmiddleware
container.bind<IUserAuthMiddleware>(TYPES.UserAuthMiddleware).to(UserAuthMiddleware);
container.bind<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware).to(AdminAuthMiddleware);

export default container;
