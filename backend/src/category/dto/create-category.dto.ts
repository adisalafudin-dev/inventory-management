import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Elektronik',
    description: 'Nama kategori alat atau bahan.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  namaKategori!: string;

  @ApiPropertyOptional({
    example: 'Kategori untuk perangkat elektronik dan aksesorinya.',
    description: 'Deskripsi tambahan mengenai kategori.',
  })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}
