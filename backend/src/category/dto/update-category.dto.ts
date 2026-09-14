import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  namaKategori!: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsNotEmpty({ message: 'ID user tidak boleh kosong' })
  idUser!: number;
}
