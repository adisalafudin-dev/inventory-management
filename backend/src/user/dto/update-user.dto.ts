import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Nama pengguna baru.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username minimal terdiri dari 3 karakter' })
  username?: string;
}
