import { HttpException } from '@nestjs/common';

export class AppError extends HttpException {
  public readonly errorCode: string;
  public readonly errors?: any[];

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    errors?: any[],
  ) {
    super(message, statusCode);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
