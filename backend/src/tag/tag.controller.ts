import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagService } from './tag.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { TagIdsDto } from './dto/tag-ids.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('tag')
@ApiTags('Tags')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat tag baru' })
  @ApiResponse({ status: 201, description: 'Tag berhasil dibuat.' })
  create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.tagService.create(createTagDto, idUser);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil semua tag' })
  @ApiResponse({ status: 200, description: 'Daftar tag berhasil diambil.' })
  findAll(@CurrentUser('id') idUser: number) {
    return this.tagService.findAll(idUser);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Mengambil tag yang terhubung dengan item' })
  @ApiResponse({ status: 200, description: 'Tag item berhasil diambil.' })
  getTagsForItem(
    @Param('itemId') itemId: string,
    @CurrentUser('id') idUser: number,
  ) {
    return this.tagService.getTagsForItem(itemId, idUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil tag berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail tag berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  findOne(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.tagService.findOne(+id, idUser);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Mengambil item yang menggunakan tag' })
  @ApiResponse({
    status: 200,
    description: 'Daftar item bertag berhasil diambil.',
  })
  getItemsForTag(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.tagService.getItemsForTag(+id, idUser);
  }

  @Post('items/:itemId')
  @ApiOperation({ summary: 'Menghubungkan tag dengan item' })
  @ApiResponse({
    status: 201,
    description: 'Tag berhasil dihubungkan dengan item.',
  })
  attachToItem(
    @Body() dto: TagIdsDto,
    @Param('itemId') itemId: string,
    @CurrentUser('id') idUser: number,
  ) {
    return this.tagService.attachToItem(dto.idTags, itemId, idUser);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Melepaskan tag dari item' })
  @ApiResponse({
    status: 200,
    description: 'Tag berhasil dilepaskan dari item.',
  })
  detachFromItem(
    @Body() dto: TagIdsDto,
    @Param('itemId') itemId: string,
    @CurrentUser('id') idUser: number,
  ) {
    return this.tagService.detachFromItem(dto.idTags, itemId, idUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui tag' })
  @ApiResponse({ status: 200, description: 'Tag berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.tagService.update(+id, updateTagDto, idUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus tag' })
  @ApiResponse({ status: 200, description: 'Tag berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  remove(@Param('id') id: number, @CurrentUser('id') idUser: number) {
    return this.tagService.remove(+id, idUser);
  }
}
