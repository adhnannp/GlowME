import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, { stack: err.stack });
  res.status(500).json({ message: 'Internal Server Error' });
};
