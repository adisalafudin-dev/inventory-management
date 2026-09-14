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

@UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard untuk melindungi semua endpoint
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll(@Query() Query: QueryLocationDto) {
    return this.locationService.findAll(Query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const userId = Number(req.user.id);
    return this.locationService.findOne(+id, userId);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const userId = Number(req.user.id);
    return this.locationService.remove(+id, userId);
  }
}
