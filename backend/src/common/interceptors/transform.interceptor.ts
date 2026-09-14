import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Ambil status kode HTTP saat ini (misal: 200, 201)
    const statusCode = context.switchToHttp().getResponse().statusCode;

    // Pipa (pipe) aliran data respons menggunakan RxJS map
    return next.handle().pipe(
      map((data) => {
        // Jika dari Controller Anda mengirimkan pesan kustom { message: "Berhasil", ...data }
        const message = data?.message || 'Permintaan berhasil diproses';

        // Bersihkan properti 'message' dari dalam payload data agar tidak redundan
        if (data && typeof data === 'object' && 'message' in data) {
          const { message: _, ...restData } = data;

          return {
            statusCode,
            message,
            // Jika setelah message dihapus datanya kosong, kembalikan null
            data: Object.keys(restData).length > 0 ? restData : null,
          };
        }

        // Format standar jika Controller hanya melempar array atau objek biasa
        return {
          statusCode,
          message,
          data: data === undefined ? null : data,
        };
      }),
    );
  }
}
