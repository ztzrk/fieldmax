import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = err.statusCode || 500;
    const message: string = err.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
