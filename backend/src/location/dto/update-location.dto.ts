import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto.js';
import { IsInt, IsNotEmpty } from 'class-validator';

class IdUserDto {
  @IsInt()
  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser: number;
}

export class UpdateLocationDto extends IntersectionType(
  PartialType(CreateLocationDto),
  IdUserDto,
) {}
