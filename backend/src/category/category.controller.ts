import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { QueryKategoriDto } from './dto/query-kategori.dto.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('category')
@UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard untuk melindungi semua endpoint
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat kategori baru' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat.' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.categoryService.create(createCategoryDto, idUser);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar kategori' })
  @ApiResponse({
    status: 200,
    description: 'Daftar kategori berhasil diambil.',
  })
  findAll(@Query() query: QueryKategoriDto, @CurrentUser('id') idUser: number) {
    return this.categoryService.findAll(query, idUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil kategori berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Detail kategori berhasil diambil.',
  })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui kategori' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser('id') idUser: number,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, idUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus kategori' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
  remove(@Param('id') id: string, @CurrentUser('id') idUser: number) {
    return this.categoryService.remove(+id, idUser);
  }
}
