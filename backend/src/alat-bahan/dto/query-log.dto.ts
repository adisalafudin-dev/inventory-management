// src/alat-bahan/dto/query-log.dto.ts
import { IsOptional, IsInt, Min, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLogMutasiDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Nomor halaman log mutasi yang ingin diambil.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Jumlah log mutasi yang ditampilkan dalam satu halaman.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 42,
    description: 'Filter log mutasi berdasarkan ID pengguna.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idUser?: number;

  @ApiPropertyOptional({
    enum: ['IN', 'OUT'],
    example: 'IN',
    description: 'Filter berdasarkan tipe mutasi barang masuk atau keluar.',
  })
  @IsOptional()
  @IsIn(['IN', 'OUT'])
  tipe?: 'IN' | 'OUT';

  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Tanggal mulai filter log mutasi dalam format ISO 8601.',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.999Z',
    description: 'Tanggal akhir filter log mutasi dalam format ISO 8601.',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
