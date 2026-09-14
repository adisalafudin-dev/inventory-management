import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStokDto {
  @IsString()
  @IsNotEmpty({ message: 'idUser tidak boleh kosong' })
  idUser!: string;

  @IsInt()
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah!: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
