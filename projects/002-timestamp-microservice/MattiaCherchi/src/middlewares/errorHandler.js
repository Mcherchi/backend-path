import { CustomError } from '../errors/customError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  res.status(400).json({ errors: [{ error: 'something went wrong' }] });
};
