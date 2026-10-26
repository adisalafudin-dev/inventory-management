import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeCodeDto {
  @ApiProperty({
    example: 'q1w2e3r4t5y6u7i8o9p0',
    description:
      'Kode sekali pakai dari redirect login Google (berlaku 60 detik).',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
