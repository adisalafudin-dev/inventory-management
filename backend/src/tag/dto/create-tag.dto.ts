import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tag tidak boleh kosong' })
  namaTag!: string;
}
