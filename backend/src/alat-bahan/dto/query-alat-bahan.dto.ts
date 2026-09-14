// src/location/dto/query-location.dto.ts
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Kondisi } from '../../common/types/kondisi.types.js';

export class QueryAlatBahanDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsEnum(Kondisi, {
    message: 'Kondisi harus berupa BAIK, KARATAN, atau RUSAK',
  })
  kondisi?: Kondisi;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
