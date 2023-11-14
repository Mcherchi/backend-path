import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const customErrors = this.errors
      .filter((err) => err.msg !== 'Invalid value')
      .map((err) => {
        if (err.type === 'field') {
          return { message: err.msg, field: err.path };
        }
        return { message: err.msg };
      });

    return customErrors;
  }
}
