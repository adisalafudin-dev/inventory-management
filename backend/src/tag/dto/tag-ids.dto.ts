import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class TagIdsDto {
  @IsArray({ message: 'idTags harus berupa array' })
  @ArrayNotEmpty({ message: 'Minimal satu tag harus dipilih' })
  @IsInt({ each: true, message: 'idTags hanya boleh berisi ID tag (angka)' })
  idTags!: number[];
}