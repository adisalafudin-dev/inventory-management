import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagIdsDto {
  @ApiProperty({
    type: [Number],
    example: [1, 2, 3],
    description: 'Daftar ID tag yang dipilih. Minimal satu ID tag.',
  })
  @IsArray({ message: 'idTags harus berupa array' })
  @ArrayNotEmpty({ message: 'Minimal satu tag harus dipilih' })
  @IsInt({ each: true, message: 'idTags hanya boleh berisi ID tag (angka)' })
  idTags!: number[];
}
