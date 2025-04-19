export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    ConnectionRepository: Symbol.for('ConnectionRepository'),
    NotificationRepository: Symbol.for('NotificationRepository'),
    ReportRepository: Symbol.for('ReportRepository'),
    BadgeRepository:Symbol.for('BadgeRepository'),
  
    // Services
    AuthService: Symbol.for('AuthService'),
    OTPService: Symbol.for('OTPService'),
    UserService: Symbol.for('UserService'),
    AdminService: Symbol.for('AdminService'),
    UsersService: Symbol.for('UsersService'),
    UserConnectionService: Symbol.for('UserConnectionService'),
    GoogleAuthService: Symbol.for('GoogleAuthService'),
    AdminBadgeService: Symbol.for('AdminBadgeService'),
    UserBadgeService: Symbol.for('UserBadgeService'),
    ForgotPasswordService: Symbol.for('ForgotPasswordService'),

    // Controllers
    AuthController: Symbol.for('AuthController'),
    UserController: Symbol.for('UserController'),
    AdminController: Symbol.for('AdminController'),
    UsersController: Symbol.for('UsersController'),
    UserConnectionController: Symbol.for('UserConnectionController'),
    GoogleAuthController: Symbol.for('GoogleAuthController'),
    AdminBadgeController: Symbol.for('AdminBadgeController'),
    UserBadgeController: Symbol.for('UserBadgeController'),
    ForgotPasswordController: Symbol.for('ForgotPasswordController'),

    //middleware
    UserAuthMiddleware: Symbol.for('UserAuthMiddleware'),
    AdminAuthMiddleware: Symbol.for('AdminAuthMiddleware'),
    UnbanUsersJob: Symbol.for('UnbanUsersJob'),

  };
  