import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    example: 'Gudang Utama',
    description: 'Nama lokasi penyimpanan alat atau bahan.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama lokasi tidak boleh kosong' })
  namaLokasi!: string;

  @ApiPropertyOptional({
    example: 'Rak A, lantai 1, dekat pintu masuk.',
    description: 'Detail atau spesifikasi letak lokasi.',
  })
  @IsString()
  @IsOptional()
  spesifikasiLetak?: string;

  @ApiProperty({
    example: 42,
    description: 'ID pengguna yang membuat lokasi.',
  })
  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser!: number;
}
