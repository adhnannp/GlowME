export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
  
    // Services
    AuthService: Symbol.for('AuthService'),
    OTPService: Symbol.for('OTPService'),
    UserService: Symbol.for('UserService'),
    AdminService: Symbol.for('AdminService'),
    UsersService: Symbol.for('UsersService'),
  
    // Controllers
    AuthController: Symbol.for('AuthController'),
    UserController: Symbol.for('UserController'),
    AdminController: Symbol.for('AdminController'),
    UsersController: Symbol.for('UsersController'),

    //middleware
    UserAuthMiddleware: Symbol.for('UserAuthMiddleware'),
    AdminAuthMiddleware: Symbol.for('AdminAuthMiddleware')
  };
  