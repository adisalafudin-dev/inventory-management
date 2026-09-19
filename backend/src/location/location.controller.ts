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
  Req,
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

@UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard untuk melindungi semua endpoint
@Controller('location')
@ApiTags('Locations')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat lokasi baru' })
  @ApiResponse({ status: 201, description: 'Lokasi berhasil dibuat.' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar lokasi' })
  @ApiResponse({ status: 200, description: 'Daftar lokasi berhasil diambil.' })
  findAll(@Query() Query: QueryLocationDto) {
    return this.locationService.findAll(Query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil lokasi berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail lokasi berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  findOne(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const userId = Number(req.user.id);
    return this.locationService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui lokasi' })
  @ApiResponse({ status: 200, description: 'Lokasi berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Req() req: { user: { id: number } },
  ) {
    const userId = Number(req.user.id); // Ambil idUser dari request
    updateLocationDto.idUser = userId; // Tambahkan idUser ke updateLocationDto
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus lokasi' })
  @ApiResponse({ status: 200, description: 'Lokasi berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Lokasi tidak ditemukan.' })
  remove(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const userId = Number(req.user.id);
    return this.locationService.remove(+id, userId);
  }
}
