import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { STATUS_CODES } from '../utils/HTTPStatusCode';
import { MESSAGES } from '../utils/ResponseMessages';

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, { stack: err.stack });
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
};
