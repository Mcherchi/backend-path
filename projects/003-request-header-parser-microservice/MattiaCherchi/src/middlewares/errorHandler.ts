import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.serializeErrors() });
  }

  res.status(500).json({
    errors: [{ message: 'Something went wrong' }],
  });
};
