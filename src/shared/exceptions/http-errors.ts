import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', errors?: any[]) {
    super(message, 400, 'BAD_REQUEST', errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', errors?: any[]) {
    super(message, 401, 'UNAUTHORIZED', errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', errors?: any[]) {
    super(message, 403, 'FORBIDDEN', errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Failed', errors: any[]) {
    super(message, 400, 'VALIDATION_ERROR', errors);
  }
}
