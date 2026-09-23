import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Elektronik',
    description: 'Nama kategori yang akan diperbarui.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  namaKategori!: string;

  @ApiPropertyOptional({
    example: 'Kategori untuk perangkat elektronik dan aksesorinya.',
    description: 'Deskripsi terbaru mengenai kategori.',
  })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}
