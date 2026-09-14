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
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { QueryKategoriDto } from './dto/query-kategori.dto.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
@UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard untuk melindungi semua endpoint
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: QueryKategoriDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: { user: { id: number } },
  ) {
    const userId = Number(req.user.id); // Ambil idUser dari request

    return this.categoryService.update(+id, {
      ...updateCategoryDto,
      idUser: userId,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: { id: number } }) {
    const userId = Number(req.user.id); // Ambil idUser dari request

    return this.categoryService.remove(+id, userId);
  }
}
