import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'Nama tag yang akan dibuat.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama tag tidak boleh kosong' })
  namaTag!: string;
}
