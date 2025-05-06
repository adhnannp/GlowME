import { Container } from 'inversify';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/auth/AuthService';
import { OTPService } from '../services/auth/OTPService';
import { UserService } from '../services/userService/UserService';
import { UserController } from '../controllers/userController/UserController';
import { AuthController } from '../controllers/auth/AuthController';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
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
import { ConnectionRepository } from '../repositories/ConnectionRepository';
import { IConnectionRepository } from '../core/interfaces/repositories/IConnectionRepository';
import { INotificationRepository } from '../core/interfaces/repositories/INotificationRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { ReportRepository } from '../repositories/ReportRepository';
import { IUserConnectionService } from '../core/interfaces/services/user/IUserConnectionService';
import { IReportRepository } from '../core/interfaces/repositories/IReportRepository';
import { UserConnectionService } from '../services/userService/user.connection.service';
import { IUserConnectionController } from '../core/interfaces/controllers/user/IUserConnectionController';
import { UserConnectionController } from '../controllers/userController/user.connection.controller';
import { GoogleAuthService } from '../services/auth/GoogleAuthService';
import { IGoogleAuthService } from '../core/interfaces/services/auth/IGoogleAuthService';
import { GoogleAuthController } from '../controllers/auth/GoogleAuthController';
import { IGoogleAuthController } from '../core/interfaces/controllers/auth/IGoogleAuthController';
import { IBadgeRepository } from '../core/interfaces/repositories/IBadgeRepository';
import { BadgeRepository } from '../repositories/BadgeRepository';
import { IAdminBadgeService } from '../core/interfaces/services/admin/IAdmin.Badge.Service';
import { AdminBadgeService } from '../services/adminService/admin.badge.service';
import { IUserBadgeService } from '../core/interfaces/services/user/IUser.Badge.Service';
import { UserBadgeService } from '../services/userService/user.badge.service';
import { IAdminBadgeController } from '../core/interfaces/controllers/admin/IAdmin.Badge.Controller';
import { AdminBadgeController } from '../controllers/adminController/admin.badge.controller';
import { IUserBadgeController } from '../core/interfaces/controllers/user/IUser.Badge.Controller';
import { UserBadgeController } from '../controllers/userController/user.badge.controller';
import { IUnbanUsersJob } from '../core/interfaces/middlewares/IUnbanUserJob';
import { UnbanUsersJob } from '../middleware/UnbanUsersJob';
import { ForgotPasswordService } from '../services/auth/ForgotPasswordService';
import { IForgotPasswordService } from '../core/interfaces/services/auth/IForgotPasswordService';
import { ForgotPasswordcontroller } from '../controllers/auth/ForgotPasswordController';
import { IForgotPasswordcontroller } from '../core/interfaces/controllers/auth/IforgotPasswordController';
import { ICoinPlanRepository } from '../core/interfaces/repositories/ICoinPlanRepository';
import { CoinPlanRepository } from '../repositories/CoinPlanRepository';
import { IAdminCoinPlanService } from '../core/interfaces/services/admin/IAdmin.CoinPlan.Service';
import { AdminCoinPlanService } from '../services/adminService/admin.coinPlan.service';
import IAdminCoinPlanController from '../core/interfaces/controllers/admin/IAdmin.CoinPlan.Controller';
import { AdminCoinPlanController } from '../controllers/adminController/admin.coinPlan.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IConnectionRepository>(TYPES.ConnectionRepository).to(ConnectionRepository);
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<IReportRepository>(TYPES.ReportRepository).to(ReportRepository);
container.bind<IBadgeRepository>(TYPES.BadgeRepository).to(BadgeRepository);
container.bind<ICoinPlanRepository>(TYPES.CoinPlanRepository).to(CoinPlanRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IUsersService>(TYPES.UsersService).to(UsersService)
container.bind<IUserConnectionService>(TYPES.UserConnectionService).to(UserConnectionService);
container.bind<IGoogleAuthService>(TYPES.GoogleAuthService).to(GoogleAuthService);
container.bind<IUserBadgeService>(TYPES.UserBadgeService).to(UserBadgeService)
container.bind<IAdminBadgeService>(TYPES.AdminBadgeService).to(AdminBadgeService);
container.bind<IForgotPasswordService>(TYPES.ForgotPasswordService).to(ForgotPasswordService);
container.bind<IAdminCoinPlanService>(TYPES.AdminCoinPlanService).to(AdminCoinPlanService);

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IUserConnectionController>(TYPES.UserConnectionController).to(UserConnectionController);
container.bind<IGoogleAuthController>(TYPES.GoogleAuthController).to(GoogleAuthController);
container.bind<IAdminBadgeController>(TYPES.AdminBadgeController).to(AdminBadgeController);
container.bind<IUserBadgeController>(TYPES.UserBadgeController).to(UserBadgeController);
container.bind<IForgotPasswordcontroller>(TYPES.ForgotPasswordController).to(ForgotPasswordcontroller);
container.bind<IAdminCoinPlanController>(TYPES.AdminCoinPlanController).to(AdminCoinPlanController)

//mmiddleware
container.bind<IUserAuthMiddleware>(TYPES.UserAuthMiddleware).to(UserAuthMiddleware);
container.bind<IAdminAuthMiddleware>(TYPES.AdminAuthMiddleware).to(AdminAuthMiddleware);
container.bind<IUnbanUsersJob>(TYPES.UnbanUsersJob).to(UnbanUsersJob);

export default container;
