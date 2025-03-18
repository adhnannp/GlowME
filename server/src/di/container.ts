// src/di/container.ts
import { Container } from 'inversify';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/auth/AuthService';
import { OTPService } from '../services/auth/OTPService';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IAuthService} from '../core/interfaces/services/IAuthService';
import { IOTPService } from '../core/interfaces/services/IOTPService';
import { AuthController } from '../controllers/auth.controller';
import { IUserService } from '../core/interfaces/services/IUserService';
import { UserService } from '../services/userService/UserService';
import { UserController } from '../controllers/userController/user.controller';

const container = new Container();

container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<IAuthService>('IAuthService').to(AuthService);
container.bind<IOTPService>('IOTPService').to(OTPService);
container.bind<IUserService>('UserService').to(UserService)

container.bind<AuthController>('AuthController').to(AuthController);
container.bind<UserController>('UserController').to(UserController)

export default container;