import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LocationService } from './location.service.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { QueryLocationDto } from './dto/query-location.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard untuk melindungi semua endpoint
@Controller('location')
@ApiTags('Locations')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat lokasi baru' })
  @ApiResponse({ status: 201, description: 'Lokasi berhasil dibuat.' })
  create(
    @Body() createLocationDto: CreateLocationDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.locationService.create(createLocationDto, idUser);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar lokasi' })
  @ApiResponse({ status: 200, description: 'Daftar lokasi berhasil diambil.' })
  findAll(@Query() query: QueryLocationDto, @CurrentUser('id') idUser: number) {
    return this.locationService.findAll(query, idUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil lokasi berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail lokasi berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  findOne(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.locationService.findOne(+id, idUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui lokasi' })
  @ApiResponse({ status: 200, description: 'Lokasi berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.locationService.update(+id, updateLocationDto, idUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus lokasi' })
  @ApiResponse({ status: 200, description: 'Lokasi berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  remove(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.locationService.remove(+id, idUser);
  }
}
