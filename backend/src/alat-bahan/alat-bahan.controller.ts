import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlatBahanService } from './alat-bahan.service.js';
import { CreateAlatBahanDto } from './dto/create-alat-bahan.dto.js';
import { UpdateAlatBahanDto } from './dto/update-alat-bahan.dto.js';
import { QueryAlatBahanDto } from './dto/query-alat-bahan.dto.js';
import { UpdateStokDto } from './dto/update-stok.dto.js';
import { QueryLogMutasiDto } from './dto/query-log.dto.js';

@Controller('alat-bahan')
export class AlatBahanController {
  constructor(private readonly alatBahanService: AlatBahanService) {}

  @Post()
  create(@Body() createAlatBahanDto: CreateAlatBahanDto) {
    return this.alatBahanService.create(createAlatBahanDto);
  }

  @Get()
  findAll(@Query() query: QueryAlatBahanDto) {
    return this.alatBahanService.findAll(query);
  }

  // ENDPOINT GLOBAL: /alat-bahan/log-mutasi
  // Harus ditaruh di atas rute yang menggunakan :id
  @UseGuards(AuthGuard('jwt'))
  @Get('log-mutasi')
  getLogGlobal(
    @Query() query: QueryLogMutasiDto,
    @Request() req: { user: { userId: number; username: string } },
  ) {
    const idUser = Number(req.user.userId); // Ambil idUser dari JWT request
    return this.alatBahanService.getHistoriMutasi(query, idUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alatBahanService.findOne(id);
  }

  // ENDPOINT SPESIFIK: /alat-bahan/:id/log
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/log')
  getLogPerBarang(
    @Param('id') idItem: string,
    @Query() query: QueryLogMutasiDto,
    @Request() req: { user: { userId: number; username: string } },
  ) {
    const idUser = Number(req.user.userId); // Ambil idUser dari JWT request
    return this.alatBahanService.getHistoriMutasi(query, idUser, idItem);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlatBahanDto: UpdateAlatBahanDto,
  ) {
    return this.alatBahanService.update(id, updateAlatBahanDto);
  }

  @Patch(':id/increase')
  increaseStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStokDto,
  ) {
    return this.alatBahanService.increaseStock(id, updateStockDto);
  }

  @Patch(':id/decrease')
  decreaseStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStokDto,
  ) {
    return this.alatBahanService.decreaseStock(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alatBahanService.remove(id);
  }
}
