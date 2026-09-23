// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext('ExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status >= 500) {
      // error 500 = bug/gak terduga, wajib full detail + stack trace
      this.logger.error(
        {
          err: exception, // pino punya serializer khusus buat Error object, otomatis ambil stack
          method: request.method,
          url: request.url,
          userId: (request as any).user?.id,
        },
        'Unhandled exception',
      );
    } else {
      // error 4xx = kesalahan client (validasi, not found, dst), cukup warn tanpa stack
      this.logger.warn(
        { method: request.method, url: request.url, status },
        typeof message === 'string' ? message : JSON.stringify(message),
      );
    }

    response.status(status).json({
      success: false,
      message,
    });
  }
}
