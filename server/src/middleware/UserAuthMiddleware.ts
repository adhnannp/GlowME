import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { injectable, inject } from "inversify";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserAuthMiddleware } from "../core/interfaces/middlewares/IUserAuthMiddleware";
import { TYPES } from "../di/types";
import { MESSAGES } from '../utils/ResponseMessages';
import { STATUS_CODES } from '../utils/HTTPStatusCode';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

@injectable()
export default class UserAuthMiddleware implements IUserAuthMiddleware {
  constructor( @inject(TYPES.UserRepository) private userRepository: IUserRepository) {}
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(STATUS_CODES.FORBIDDEN).json({ error: MESSAGES.NO_TOKEN_PROVIDED });
      return;
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      const user = await this.userRepository.findUserById(decoded.userId);
      if (!user || user.isBlock ) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_INVALID_OR_BANNED });
        return;
      }
      if(user.isAdmin){
        res.status(STATUS_CODES.UNAUTHORIZED).json({message:MESSAGES.ACCESS_DENIED})
        return
      }
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(STATUS_CODES.FORBIDDEN).json({ message: MESSAGES.INVALID_OR_EXPIRED_TOKEN });
      return;
    }
  }
}
