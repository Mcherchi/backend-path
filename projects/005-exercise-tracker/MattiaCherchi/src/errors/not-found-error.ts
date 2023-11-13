import { CustomError } from './custom-Error';

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('Resource Not Found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Resource Not Found' }];
  }
}
