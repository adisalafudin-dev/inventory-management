import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AlatBahan } from '../alat-bahan/entities/alat-bahan.entity.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(idUser: number) {
    // Gunakan Promise.all untuk mengeksekusi kueri secara paralel
    const [totalBarang, stokMenipis, rusak, logTerbaru] = await Promise.all([
      // 1. Hitung Total Jenis Komponen (menggunakan aggregate)
      this.prisma.db.orm.public.AlatBahan.where({ idUser }).aggregate((a) => ({
        total: a.count(),
      })),

      // 2. Daftar Stok Menipis (kuantitas di bawah 5)
      this.prisma.db.orm.public.AlatBahan.where({ idUser })
        .where((a) => a.kuantitas.lt(5)) // Operator less than (<) di Prisma 8
        .limit(10) // Dibatasi 10 agar payload tidak terlalu besar
        .all(),

      // 3. Jumlah Komponen dengan kondisi "Rusak"
      this.prisma.db.orm.public.AlatBahan.where({ idUser })
        .where((a) => a.kondisi.like('%rusak%')) // Pencarian kata 'rusak'
        .aggregate((a) => ({ total: a.count() })),

      // 4. Aktivitas Mutasi 5 Terakhir
      this.prisma.db.orm.public.LogMutasi.where((log) =>
        log.alatBahan.some((ab) => ab.idUser.eq(idUser)),
      )
        .orderBy((log) => log.tanggal.desc())
        .limit(5)
        .include('alatBahan')
        .all(),
    ]);

    // Format balikan JSON agar mudah dibaca oleh Frontend
    return {
      statistik: {
        totalJenisBarang: totalBarang.total,
        totalBarangRusak: rusak.total,
      },
      peringatan: {
        stokMenipis,
      },
      aktivitasTerbaru: logTerbaru,
    };
  }
}
