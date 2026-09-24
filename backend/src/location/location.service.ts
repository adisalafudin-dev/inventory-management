import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryLocationDto } from './dto/query-location.dto.js';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}
  create(createLocationDto: CreateLocationDto, idUser: number) {
    const result = this.prisma.db.orm.public.LokasiPenyimpanan.create({
      idUser: idUser,
      namaLokasi: createLocationDto.namaLokasi,
      spesifikLetak: createLocationDto.spesifikasiLetak,
    });
    return result;
  }

  async findAll(query: QueryLocationDto, idUser: number) {
    const { search, page = 1, limit = 10 } = query;
    const offsetValue = (page - 1) * limit;

    let baseQuery = this.prisma.db.orm.public.LokasiPenyimpanan.where((l) =>
      l.idUser.eq(idUser),
    );

    if (search) {
      baseQuery = baseQuery.where(
        (l) => l.idUser.eq(idUser) && l.namaLokasi.like(`%${search}%`),
      );
    }

    const data = await baseQuery
      .orderBy((l) => l.id.desc())
      .limit(limit)
      .offset(offsetValue)
      .all();

    console.log(data);

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
    const lokasi = await this.prisma.db.orm.public.LokasiPenyimpanan.first({
      id: id,
      idUser: idUser,
    });

    if (!lokasi) throw new NotFoundException('Lokasi tidak ditemukan');
    if (lokasi.idUser !== idUser) throw new ForbiddenException('Akses ditolak');

    return this.prisma.db.orm.public.LokasiPenyimpanan.where({
      id: id,
      idUser: idUser,
    }).first();
  }

  update(id: number, updateLocationDto: UpdateLocationDto, idUser: number) {
    return this.prisma.db.orm.public.LokasiPenyimpanan.where({
      id: id,
      idUser: idUser,
    }).update({
      ...updateLocationDto,
      idUser: idUser,
    });
  }

  remove(id: number, idUser: number) {
    return this.prisma.db.orm.public.LokasiPenyimpanan.where({
      id: id,
      idUser: idUser,
    }).delete();
  }
}
