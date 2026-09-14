// src/common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch() // Kosongkan dekorator ini agar menangkap semua jenis exception
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Tentukan HTTP Status Code (jika HttpException ambil statusnya, jika error sistem set ke 500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ekstrak pesan dari exception
    let message = 'Terjadi kesalahan pada server internal';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Menangkap error validasi dari class-validator (biasanya berbentuk array)
        const msg = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg[0] : msg;
        errorType = (exceptionResponse as any).error || 'Error';
      }
    } else if (exception instanceof Error) {
      // (Opsional) Tampilkan pesan error asli jika itu error sistem,
      // namun di production biasanya ini disembunyikan agar lebih aman.
      message = exception.message;
    }

    // Kembalikan JSON dengan struktur yang konsisten dengan TransformInterceptor
    response.status(status).json({
      statusCode: status,
      message: message,
      error: errorType,
      data: null, // Selalu null jika terjadi error
    });
  }
}
