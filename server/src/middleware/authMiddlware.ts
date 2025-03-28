import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

// Middleware to check if the user is authenticated
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}


// Middleware to restrict if already logged in
export function restrictIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Already logged in" });
    }
    
    next();
}

// Middleware to restrict logged out
export function restrictIfLoggedOut(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }

    next();
}
