import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateAlatBahanDto } from './dto/create-alat-bahan.dto.js';
import { UpdateAlatBahanDto } from './dto/update-alat-bahan.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryAlatBahanDto } from './dto/query-alat-bahan.dto.js';
import { UpdateStokDto } from './dto/update-stok.dto.js';
import { QueryLogMutasiDto } from './dto/query-log.dto.js';
import { Temporal } from '@js-temporal/polyfill';

@Injectable()
export class AlatBahanService {
  constructor(private prisma: PrismaService) {}

  async catatMutasi(
    orm: PrismaService['db']['orm'],
    idItem: string,
    idUser: number,
    dto: {
      jumlah: number;
      tipe: 'IN' | 'OUT' | 'AUDIT';
      keterangan?: string;
    },
  ) {
    const item = await orm.public.AlatBahan.where({
      id: idItem,
      idUser: idUser,
    }).first();

    if (!item) throw new NotFoundException('item tidak ditemukan');
    if (item.idUser !== idUser) throw new ForbiddenException('Akses ditolak');

    return orm.public.LogMutasi.create({
      id: randomUUID(),
      idItem: idItem,
      jumlahPerubahan: dto.jumlah,
      tipe: dto.tipe,
      keterangan: dto.keterangan,
    });
  }

  async create(createAlatBahanDto: CreateAlatBahanDto, idUser: number) {
    return this.prisma.db.transaction(async (tx) => {
      const data = await tx.orm.public.AlatBahan.create({
        id: randomUUID(),
        namaBarang: createAlatBahanDto.namaBarang,
        kuantitas: createAlatBahanDto.kuantitas,
        kondisi: createAlatBahanDto.kondisi,
        updatedAt: new Date().toISOString(),
        idUser: idUser,
        idLokasi: Number(createAlatBahanDto.idLokasi),
        idKategori: Number(createAlatBahanDto.idKategori),
      });

      // Buat log mutasi awal (tipe: IN) în același transakcija
      const mutation = await this.catatMutasi(tx.orm, data.id, Number(idUser), {
        jumlah: createAlatBahanDto.kuantitas,
        tipe: 'IN',
        keterangan: 'Pencatatan awal alat/bahan',
      });

      return { data, mutation };
    });
  }

  async findAll(query: QueryAlatBahanDto, idUser: number) {
    const { search, kondisi, page = 1, limit = 10 } = query;
    const offsetValue = (page - 1) * limit;

    let baseQuery = this.prisma.db.orm.public.AlatBahan.where((a) =>
      a.idUser.eq(idUser),
    );

    if (search) {
      baseQuery = baseQuery.where(
        (a) => a.idUser.eq(idUser) && a.namaBarang.like(`%${search}%`),
      );
    }

    if (kondisi) {
      baseQuery = baseQuery.where(
        (a) => a.idUser.eq(idUser) && a.kondisi.like(`%${kondisi}%`),
      );
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

  async findOne(id: string, idUser: number) {
    const item = await this.prisma.db.orm.public.AlatBahan.where({
      id,
      idUser,
    }).first();

    if (!item) throw new NotFoundException('Item tidak ditemukan');
    return item;
  }

  async update(
    id: string,
    updateAlatBahanDto: UpdateAlatBahanDto,
    userId: number,
  ) {
    return this.prisma.db.transaction(async (tx) => {
      const current = await tx.orm.public.AlatBahan.where({ id }).first();
      if (!current) throw new NotFoundException('Item tidak ditemukan');
      if (current.idUser !== userId)
        throw new ForbiddenException('Akses ditolak');

      const currentUserId = userId ? Number(userId) : (current.idUser ?? NaN);
      const newKuantitas = updateAlatBahanDto.kuantitas ?? current.kuantitas;
      const delta = newKuantitas - current.kuantitas;
      const tipe = delta >= 0 ? 'IN' : delta < 0 ? 'OUT' : 'AUDIT';

      // Buat log mutasi pertama (IN/OUT sesuai delta kuantitas)
      const mutation = await this.catatMutasi(tx.orm, id, currentUserId, {
        jumlah: Math.abs(delta),
        tipe,
        keterangan: 'Pencatatan perubahan alat/bahan',
      });

      const data = await tx.orm.public.AlatBahan.where({
        id,
        idUser: currentUserId,
      }).update({
        namaBarang: updateAlatBahanDto.namaBarang,
        kuantitas: updateAlatBahanDto.kuantitas,
        kondisi: updateAlatBahanDto.kondisi,
        updatedAt: new Date().toISOString(),
        idUser: currentUserId,
        idLokasi: updateAlatBahanDto.idLokasi
          ? Number(updateAlatBahanDto.idLokasi)
          : undefined,
        idKategori: updateAlatBahanDto.idKategori
          ? Number(updateAlatBahanDto.idKategori)
          : undefined,
      });

      return { data, mutation };
    });
  }

  async increaseStock(
    id: string,
    updateStockDto: UpdateStokDto,
    userId: number,
  ) {
    return this.prisma.db.transaction(async (tx) => {
      const current = await tx.orm.public.AlatBahan.where({ id }).first();
      if (!current) throw new NotFoundException('Item tidak ditemukan');
      if (current.idUser !== userId)
        throw new ForbiddenException('Akses ditolak');

      const currentUserId = userId ? Number(userId) : (current.idUser ?? NaN);

      const mutation = await this.catatMutasi(tx.orm, id, currentUserId, {
        jumlah: updateStockDto.jumlah,
        tipe: 'IN',
        keterangan: 'Pencatatan increase perubahan alat/bahan',
      });

      const newQuantity = (current.kuantitas += updateStockDto.jumlah);

      const data = await tx.orm.public.AlatBahan.where({
        id,
        idUser: currentUserId,
      }).update({
        kuantitas: newQuantity,
      });

      return { data, mutation };
    });
  }

  async decreaseStock(
    id: string,
    updateStockDto: UpdateStokDto,
    userId: number,
  ) {
    return this.prisma.db.transaction(async (tx) => {
      const current = await tx.orm.public.AlatBahan.where({ id }).first();
      if (!current) throw new NotFoundException('Item tidak ditemukan');
      if (current.idUser !== userId)
        throw new ForbiddenException('Akses ditolak');

      const currentUserId = userId ? Number(userId) : (current.idUser ?? NaN);

      const mutation = await this.catatMutasi(tx.orm, id, currentUserId, {
        jumlah: updateStockDto.jumlah,
        tipe: 'OUT',
        keterangan: `Pencatatan pengurangan stock ${updateStockDto.jumlah} alat/bahan`,
      });

      const newQuantity = (current.kuantitas -= updateStockDto.jumlah);

      const data = await tx.orm.public.AlatBahan.where({
        id,
        idUser: currentUserId,
      }).update({
        kuantitas: newQuantity,
      });

      return { data, mutation };
    });
  }

  async getHistoriMutasi(
    query: QueryLogMutasiDto,
    idUser?: number,
    idItem?: string,
  ) {
    const { page = 1, limit = 10, tipe, startDate, endDate } = query;
    const offsetValue = (page - 1) * limit;

    // 1. Kueri dasar
    let baseQuery = this.prisma.db.orm.public.LogMutasi;

    // Filtar log hanya untuk alatBahan milik user yang login

    const itemIds = (
      await this.prisma.db.orm.public.AlatBahan.where({
        idUser: idUser,
      })
        .select('id')
        .all()
    ).map((item) => item.id);

    if (itemIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    baseQuery = baseQuery.where((log) => log.idItem.in(itemIds));

    // 2. Jika dipanggil dari rute spesifik barang (/alat-bahan/:id/log)
    if (idItem) {
      baseQuery = baseQuery.where({ idItem });
    }

    // 3. Filter tipe (IN / OUT / AUDIT)
    if (tipe) {
      baseQuery = baseQuery.where({ tipe });
    }

    // 4. Filter rentang tanggal (tanggal adalah timestamptz-temporal -> Temporal.Instant)
    if (startDate) {
      const start = Temporal.Instant.from(new Date(startDate).toISOString());
      baseQuery = baseQuery.where((log) => log.tanggal.gte(start));
    }

    if (endDate) {
      // Jika endDate hanya "YYYY-MM-DD", gunakan sebagai akhir hari (23:59:59.999)
      const rawEnd =
        endDate.length <= 10 ? `${endDate}T23:59:59.999Z` : endDate;
      const end = Temporal.Instant.from(new Date(rawEnd).toISOString());
      baseQuery = baseQuery.where((log) => log.tanggal.lte(end));
    }

    // 5. Eksekusi data dengan include untuk menarik nama barangnya juga
    const data = await baseQuery
      .orderBy((log) => log.tanggal.desc())
      .limit(limit)
      .offset(offsetValue)
      .include('alatBahan')
      .all();

    // 6. Hitung total untuk paginasi
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

  async exportCsv(idUser: number): Promise<string> {
    // 1. Ambil seluruh data barang milik user
    const items = await this.prisma.db.orm.public.AlatBahan.where({ idUser })
      .include('kategori')
      .include('lokasi')
      .orderBy((a) => a.namaBarang.asc())
      .all();

    // 2. Buat Header CSV
    const csvRows = ['ID,Nama Barang,Kategori,Lokasi,Stok,Kondisi'];

    // 3. Looping data dan gabungkan dengan koma
    for (const item of items) {
      // Hilangkan tanda kutip ganda dari teks agar tidak merusak format CSV
      const nama = `"${item.namaBarang.replace(/"/g, '""')}"`;
      const kategori = item.kategori
        ? `"${item.kategori.namaKategori}"`
        : 'Tanpa Kategori';
      const lokasi = item.lokasi
        ? `"${item.lokasi.namaLokasi}"`
        : 'Tanpa Lokasi';
      const kondisi = `"${item.kondisi}"`;

      // Masukkan ke array per baris
      csvRows.push(
        `${item.id},${nama},${kategori},${lokasi},${item.kuantitas},${kondisi}`,
      );
    }

    // 4. Gabungkan semua baris dengan enter (\n)
    return csvRows.join('\n');
  }

  remove(id: string, idUser: number) {
    return this.prisma.db.orm.public.AlatBahan.where({ id, idUser }).delete();
  }
}
