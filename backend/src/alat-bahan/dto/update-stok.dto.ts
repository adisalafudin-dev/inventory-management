import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStokDto {
  @ApiProperty({
    example: 'clxyz1234567890',
    description: 'ID pengguna yang melakukan perubahan stok.',
  })
w  @ApiProperty({
    example: 5,
    description: 'Jumlah stok yang ditambahkan atau dikurangi.',
  })
  @IsInt()
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah!: number;

  @ApiPropertyOptional({
    example: 'Pengeluaran untuk kegiatan operasional',
    description: 'Keterangan tambahan mengenai perubahan stok.',
  })
  @IsOptional()
  @IsString()
  keterangan?: string;
}
