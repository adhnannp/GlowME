export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    ConnectionRepository: Symbol.for('ConnectionRepository'),
    NotificationRepository: Symbol.for('NotificationRepository'),
    ReportRepository: Symbol.for('ReportRepository'),
  
    // Services
    AuthService: Symbol.for('AuthService'),
    OTPService: Symbol.for('OTPService'),
    UserService: Symbol.for('UserService'),
    AdminService: Symbol.for('AdminService'),
    UsersService: Symbol.for('UsersService'),
    UserConnectionService: Symbol.for('UserConnectionService'),  
  
    // Controllers
    AuthController: Symbol.for('AuthController'),
    UserController: Symbol.for('UserController'),
    AdminController: Symbol.for('AdminController'),
    UsersController: Symbol.for('UsersController'),
    UserConnectionController: Symbol.for('UserConnectionController'),

    //middleware
    UserAuthMiddleware: Symbol.for('UserAuthMiddleware'),
    AdminAuthMiddleware: Symbol.for('AdminAuthMiddleware'),

  };
  