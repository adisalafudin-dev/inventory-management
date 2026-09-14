import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Kondisi } from '../../common/types/kondisi.types.js';

export class CreateAlatBahanDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama alat/bahan tidak boleh kosong' })
  namaBarang!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Kuantitas alat/bahan tidak boleh kosong' })
  kuantitas!: number;

  @IsNotEmpty({ message: 'Kondisi alat/bahan tidak boleh kosong' })
  @IsEnum(Kondisi, {
    message: 'Kondisi harus berupa BAIK, KARATAN, atau RUSAK',
  })
  kondisi!: Kondisi;

  @IsString()
  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser!: string;

  @IsString()
  @IsNotEmpty({ message: 'idLokasi tidak boleh kosong' })
  idLokasi!: string;

  @IsString()
  @IsNotEmpty({ message: 'idKategori tidak boleh kosong' })
  idKategori!: string;
}
