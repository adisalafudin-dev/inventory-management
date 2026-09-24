import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlatBahanService } from './alat-bahan.service.js';
import { CreateAlatBahanDto } from './dto/create-alat-bahan.dto.js';
import { UpdateAlatBahanDto } from './dto/update-alat-bahan.dto.js';
import { QueryAlatBahanDto } from './dto/query-alat-bahan.dto.js';
import { UpdateStokDto } from './dto/update-stok.dto.js';
import { QueryLogMutasiDto } from './dto/query-log.dto.js';
import type { Response as ExpressResponse } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('alat-bahan')
@ApiTags('Alat dan Bahan')
@ApiBearerAuth()
export class AlatBahanController {
  constructor(private readonly alatBahanService: AlatBahanService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat data alat atau bahan baru' })
  @ApiResponse({
    status: 201,
    description: 'Data alat atau bahan berhasil dibuat.',
  })
  create(
    @Body() createAlatBahanDto: CreateAlatBahanDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.create(createAlatBahanDto, idUser);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar alat dan bahan' })
  @ApiResponse({
    status: 200,
    description: 'Daftar alat dan bahan berhasil diambil.',
  })
  findAll(
    @Query() query: QueryAlatBahanDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.findAll(query, idUser);
  }

  // ENDPOINT GLOBAL: /alat-bahan/log-mutasi
  // Harus ditaruh di atas rute yang menggunakan :id
  @UseGuards(AuthGuard('jwt'))
  @Get('log-mutasi')
  @ApiOperation({ summary: 'Mengambil seluruh riwayat mutasi inventori' })
  @ApiResponse({ status: 200, description: 'Riwayat mutasi berhasil diambil.' })
  getLogGlobal(
    @Query() query: QueryLogMutasiDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.getHistoriMutasi(query, idUser);
  }

  @Get('export')
  @ApiOperation({ summary: 'Mengunduh laporan inventori dalam format CSV' })
  @ApiResponse({
    status: 200,
    description: 'File laporan CSV berhasil dibuat dan diunduh.',
  })
  async downloadCsv(
    @CurrentUser('id') idUser: number,
    // 1. Add passthrough: true to allow dynamic modifications while returning values normally
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    // 2. Fetch the CSV string data from your service
    const csvData = await this.alatBahanService.exportCsv(idUser);

    // 3. Generate your dynamic date and filename
    const date = new Date().toISOString().split('T')[0];
    const fileName = `laporan_inventaris_${date}.csv`;

    // 4. Manually set the dynamic headers on the response object
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    // 5. Simply return the data. NestJS handles the 200 OK status automatically.
    return csvData;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil alat atau bahan berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Detail alat atau bahan berhasil diambil.',
  })
  @ApiResponse({ status: 404, description: 'Alat atau bahan tidak ditemukan.' })
  findOne(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.alatBahanService.findOne(id, idUser);
  }

  // ENDPOINT SPESIFIK: /alat-bahan/:id/log
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/log')
  @ApiOperation({
    summary: 'Mengambil riwayat mutasi alat atau bahan tertentu',
  })
  @ApiResponse({
    status: 200,
    description: 'Riwayat mutasi item berhasil diambil.',
  })
  getLogPerBarang(
    @Param('id') idItem: string,
    @Query() query: QueryLogMutasiDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.getHistoriMutasi(query, idUser, idItem);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui data alat atau bahan' })
  @ApiResponse({
    status: 200,
    description: 'Data alat atau bahan berhasil diperbarui.',
  })
  @ApiResponse({ status: 404, description: 'Alat atau bahan tidak ditemukan.' })
  update(
    @Param('id') id: string,
    @Body() updateAlatBahanDto: UpdateAlatBahanDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.update(id, updateAlatBahanDto, idUser);
  }

  @Patch(':id/increase')
  @ApiOperation({ summary: 'Menambah stok alat atau bahan' })
  @ApiResponse({ status: 200, description: 'Stok berhasil ditambah.' })
  @ApiResponse({ status: 404, description: 'Alat atau bahan tidak ditemukan.' })
  increaseStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStokDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.increaseStock(id, updateStockDto, idUser);
  }

  @Patch(':id/decrease')
  @ApiOperation({ summary: 'Mengurangi stok alat atau bahan' })
  @ApiResponse({ status: 200, description: 'Stok berhasil dikurangi.' })
  @ApiResponse({ status: 404, description: 'Alat atau bahan tidak ditemukan.' })
  decreaseStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStokDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.alatBahanService.decreaseStock(id, updateStockDto, idUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus alat atau bahan' })
  @ApiResponse({
    status: 200,
    description: 'Alat atau bahan berhasil dihapus.',
  })
  @ApiResponse({ status: 404, description: 'Alat atau bahan tidak ditemukan.' })
  remove(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.alatBahanService.remove(id, idUser);
  }
}
