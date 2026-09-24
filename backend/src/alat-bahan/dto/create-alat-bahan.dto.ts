import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Kondisi } from '../../common/types/kondisi.types.js';

export class CreateAlatBahanDto {
  @ApiProperty({
    example: 'Laptop Dell Latitude 5420',
    description: 'Nama alat atau bahan yang akan ditambahkan.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama alat/bahan tidak boleh kosong' })
  namaBarang!: string;

  @ApiProperty({
    example: 10,
    description: 'Jumlah alat atau bahan yang tersedia.',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Kuantitas alat/bahan tidak boleh kosong' })
  kuantitas!: number;

  @ApiProperty({
    enum: Kondisi,
    example: Kondisi.BAIK,
    description: 'Kondisi alat atau bahan saat didaftarkan.',
  })
  @IsNotEmpty({ message: 'Kondisi alat/bahan tidak boleh kosong' })
  @IsEnum(Kondisi, {
    message: 'Kondisi harus berupa BAIK, KARATAN, atau RUSAK',
  })
  kondisi!: Kondisi;

  @ApiProperty({
    example: 'clxyz1234567890',
    description: 'ID pengguna yang memiliki atau mendaftarkan alat/bahan.',
  })
  @ApiProperty({
    example: 'clloc1234567890',
    description: 'ID lokasi penyimpanan alat atau bahan.',
  })
  @IsString()
  @IsNotEmpty({ message: 'idLokasi tidak boleh kosong' })
  idLokasi!: string;

  @ApiProperty({
    example: 'clcat1234567890',
    description: 'ID kategori alat atau bahan.',
  })
  @IsString()
  @IsNotEmpty({ message: 'idKategori tidak boleh kosong' })
  idKategori!: string;
}
