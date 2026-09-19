import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    example: 'User Name',
    description: 'john doe',
  })
  @IsString()
  @MinLength(3, { message: 'Username minimal terdiri dari 3 karakter' })
  username!: string;

  @ApiProperty({
    example: 'User Email',
    description: 'johndoe@email.com',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @ApiProperty({
    example: 'User Password',
    description: 'secret123',
  })
  @IsString()
  @MinLength(6, { message: 'Password minimal terdiri dari 6 karakter' })
  password!: string;
}
