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

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IUserService>(TYPES.UserService).to(UserService);

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserController>(TYPES.UserController).to(UserController);

export default container;
