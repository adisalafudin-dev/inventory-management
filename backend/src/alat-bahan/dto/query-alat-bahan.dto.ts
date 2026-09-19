// src/location/dto/query-location.dto.ts
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Kondisi } from '../../common/types/kondisi.types.js';

export class QueryAlatBahanDto {
  @ApiPropertyOptional({
    example: 'laptop',
    description: 'Kata kunci untuk mencari nama alat atau bahan.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Nomor halaman data yang ingin diambil.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    enum: Kondisi,
    example: Kondisi.BAIK,
    description: 'Filter berdasarkan kondisi alat atau bahan.',
  })
  @IsOptional()
  @IsEnum(Kondisi, {
    message: 'Kondisi harus berupa BAIK, KARATAN, atau RUSAK',
  })
  kondisi?: Kondisi;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Jumlah data yang ditampilkan dalam satu halaman.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
