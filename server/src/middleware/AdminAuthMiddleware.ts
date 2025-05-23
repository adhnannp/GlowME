import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { injectable, inject } from "inversify";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IAdminAuthMiddleware } from "../core/interfaces/middlewares/IAdminAuthMiddleware";
import { TYPES } from "../di/types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

@injectable()
export default class AdminAuthMiddleware implements IAdminAuthMiddleware {
  constructor( @inject(TYPES.UserRepository) private userRepository: IUserRepository) {}
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(403).json({ error: "No token provided" });
      return;
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      const user = await this.userRepository.findUserById(decoded.userId);
      if (!user || user.isBlock ) {
        res.status(400).json({ message: "User invalid or banned" });
        return;
      }
      if(!user.isAdmin){
        res.status(401).json({message:"Access denied"})
        return;
      }
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
  }
}
