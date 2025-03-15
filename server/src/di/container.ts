// src/di/container.ts
import { Container } from 'inversify';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/auth/UserService';
import { OTPService } from '../services/auth/OTPService';
import { IUserRepository } from '../core/interfaces/repositeries/IUserRepository';
import { IUserService } from '../core/interfaces/services/IUserService';
import { IOTPService } from '../core/interfaces/services/IOTPService';
import { UserController } from '../controllers/UserController';

const container = new Container();
container.bind<IUserRepository>('IUserRepository').to(UserRepository);
container.bind<IUserService>('IUserService').to(UserService);
container.bind<IOTPService>('IOTPService').to(OTPService);
container.bind<UserController>('UserController').to(UserController);

export default container;