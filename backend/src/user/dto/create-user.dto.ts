import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Alamat email pengguna.',
  })
  email!: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Nama pengguna untuk identitas akun.',
  })
  username!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Kata sandi akun pengguna.',
  })
  password!: string;
}
