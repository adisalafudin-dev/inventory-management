import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lokasi tidak boleh kosong' })
  namaLokasi!: string;
  @IsString()
  @IsOptional()
  spesifikasiLetak?: string;

  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser!: number;
}
