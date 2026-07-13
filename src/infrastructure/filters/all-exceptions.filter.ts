import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../../shared/exceptions/app-error';
import { IErrorResponse } from '../../shared/interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Lỗi hệ thống không mong muốn';
    let errors: any[] | undefined = undefined;

    try {
      if (exception instanceof AppError) {
        statusCode = exception.getStatus();
        errorCode = exception.errorCode;
        message = exception.message;
        errors = exception.errors;
      } else if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null
        ) {
          const res = exceptionResponse as Record<string, any>;
          if (Array.isArray(res.message)) {
            message = res.message[0];
            errorCode = 'VALIDATION_ERROR';
            errors = res.message;
          } else if (typeof res.message === 'string') {
            message = res.message;
            errorCode =
              res.error?.toUpperCase().replace(/\s+/g, '_') || 'HTTP_ERROR';
          } else {
            message = exception.message;
            errorCode = 'HTTP_ERROR';
          }
        } else if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
          errorCode = 'HTTP_ERROR';
        }
      } else if (
        exception instanceof Error &&
        exception.constructor.name.startsWith('Prisma')
      ) {
        this.logger.error(
          `[Prisma Error] ${exception.message}`,
          exception.stack,
        );
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorCode = 'DATABASE_ERROR';
        message = 'Lỗi xử lý dữ liệu, vui lòng thử lại';
      } else if (exception instanceof Error) {
        this.logger.error(
          `[Unhandled Error] ${exception.message}`,
          exception.stack,
        );
        message =
          process.env.NODE_ENV === 'production'
            ? 'Lỗi hệ thống không mong muốn'
            : exception.message;
      } else {
        this.logger.error(`[Unknown Exception] ${JSON.stringify(exception)}`);
      }
    } catch (filterError) {
      this.logger.error(
        `[CRITICAL] AllExceptionsFilter crashed while handling exception`,
        filterError instanceof Error ? filterError.stack : String(filterError),
      );
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = 'Lỗi hệ thống nghiêm trọng';
    }

    const errorResponse: IErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      errorCode,
      message,
      ...(errors && { errors }),
    };

    this.logger.error(
      `[${request.method}] ${request.url} → ${statusCode} ${errorCode}: ${message}`,
    );

    response.status(statusCode).json(errorResponse);
  }
}
