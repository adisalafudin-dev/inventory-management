import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(3, { message: 'Username minimal terdiri dari 3 karakter' })
  username!: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal terdiri dari 6 karakter' })
  password!: string;
}
