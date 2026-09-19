import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto.js';
import { IsInt, IsNotEmpty } from 'class-validator';

class IdUserDto {
  @ApiProperty({
    example: 42,
    description: 'ID pengguna yang melakukan perubahan lokasi.',
  })
  @IsInt()
  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser: number;
}

export class UpdateLocationDto extends IntersectionType(
  PartialType(CreateLocationDto),
  IdUserDto,
) {}
