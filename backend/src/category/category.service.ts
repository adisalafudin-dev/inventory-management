import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryKategoriDto } from './dto/query-kategori.dto.js';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, idUser: number) {
    const sameName = await this.prisma.db.orm.public.Kategori.where({
      namaKategori: createCategoryDto.namaKategori,
      idUser: idUser,
    }).all();

    if (
      sameName.some(
        (category) =>
          category.namaKategori.toLowerCase() ===
          createCategoryDto.namaKategori.toLowerCase(),
      )
    ) {
      throw new ConflictException('Kategori dengan nama tersebut sudah ada');
    }

    return this.prisma.db.orm.public.Kategori.create({
      idUser: idUser,
      namaKategori: createCategoryDto.namaKategori,
      deskripsi: createCategoryDto.deskripsi,
    });
  }

  async findAll(query: QueryKategoriDto, idUser: number) {
    const { search, page = 1, limit = 10 } = query;
    const offsetValue = (page - 1) * limit;

    // Filter user dipasang di query dasar supaya data DAN total ikut terfilter
    let baseQuery = this.prisma.db.orm.public.Kategori.where({ idUser });

    if (search) {
      baseQuery = baseQuery.where((k) => k.namaKategori.like(`%${search}%`));
    }

    const data = await baseQuery
      .orderBy((k) => k.id.desc())
      .limit(limit)
      .offset(offsetValue)
      .all();

    const result = await baseQuery.aggregate((a) => ({ total: a.count() }));

    return {
      data,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  async findOne(id: number, idUser: number) {
    const category = await this.prisma.db.orm.public.Kategori.where({
      id,
      idUser,
    }).first();

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.findOne(id, userId);

    return this.prisma.db.orm.public.Kategori.where({
      id,
      idUser: userId,
    }).update({
      namaKategori: updateCategoryDto.namaKategori,
      deskripsi: updateCategoryDto.deskripsi,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.db.orm.public.Kategori.where({
      id,
      idUser: userId,
    }).delete();
  }
}
