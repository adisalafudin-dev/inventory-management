import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto, idUser: number) {
    // Duplikat dicek hanya di antara tag milik user yang sama
    const existingTags = await this.prisma.db.orm.public.Tag.where({
      userId: idUser,
    }).all();
    const duplicate = existingTags.some(
      (tag) =>
        tag.namaTag.toLowerCase() === createTagDto.namaTag.trim().toLowerCase(),
    );

    if (duplicate) {
      throw new ConflictException('Tag dengan nama tersebut sudah ada');
    }

    return this.prisma.db.orm.public.Tag.create({
      namaTag: createTagDto.namaTag.trim(),
      userId: idUser,
    });
  }

  async findAll(idUser: number) {
    return this.prisma.db.orm.public.Tag.where({
      userId: idUser,
    })
      .orderBy((tag) => tag.namaTag.asc())
      .all();
  }

  async findOne(id: number, idUser: number) {
    const tag = await this.prisma.db.orm.public.Tag.where({
      id,
      userId: idUser,
    }).first();
    if (!tag) throw new NotFoundException('Tag tidak ditemukan');

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto, idUser: number) {
    const current = await this.findOne(id, idUser);
    const namaTag = updateTagDto.namaTag?.trim();

    if (namaTag && namaTag.toLowerCase() !== current.namaTag.toLowerCase()) {
      // Cek duplikat hanya di antara tag milik user yang sama
      const existingTags = await this.prisma.db.orm.public.Tag.where({
        userId: idUser,
      }).all();
      const duplicate = existingTags.some(
        (tag) =>
          tag.id !== id && tag.namaTag.toLowerCase() === namaTag.toLowerCase(),
      );

      if (duplicate) {
        throw new ConflictException('Tag dengan nama tersebut sudah ada');
      }
    }

    return this.prisma.db.orm.public.Tag.where({ id }).update({
      namaTag: namaTag ?? current.namaTag,
    });
  }

  async remove(id: number, idUser: number) {
    await this.findOne(id, idUser);
    return this.prisma.db.orm.public.Tag.where({ id }).delete();
  }

  async getTagsForItem(idItem: string, idUser: number) {
    const item = await this.prisma.db.orm.public.AlatBahan.where({
      id: idItem,
    }).first();
    if (!item) throw new NotFoundException('Alat/bahan tidak ditemukan');
    if (item.idUser !== idUser) throw new ForbiddenException('Akses ditolak');

    return this.prisma.db.orm.public.AlatBahanTag.where({ alatBahanId: idItem })
      .include('tag')
      .all();
  }

  async getItemsForTag(idTag: number, idUser: number) {
    await this.findOne(idTag, idUser);

    return this.prisma.db.orm.public.AlatBahanTag.where({ tagId: idTag })
      .include('alatBahan')
      .all();
  }

  async attachToItem(idTags: number[], idItem: string, idUser: number) {
    // Id Tags di simpan ke Set dengan nama variable uniqueIds
    // Memakai Set karena dapat menyimpan value yang berbeda beda sehingga tidak ada duplikasi di idTags
    const uniqueIds = [...new Set(idTags)];

    // Memakai transaction supaya data lebih aman dan tidak langsung berubah di database ketika terjadi kesalahan
    // e.g salah satu item atau tag ternyata tidak ada di database
    return this.prisma.db.transaction(async (tx) => {
      // mencari item yang di kirimkan dari parameter
      const item = await tx.orm.public.AlatBahan.where({
        id: idItem,
      }).first();
      if (!item) throw new NotFoundException('Alat/bahan tidak ditemukan');
      if (item.idUser !== idUser) throw new ForbiddenException('Akses ditolak');

      // Semua tag harus ada dan milik user yang sama
      const tags = await Promise.all(
        uniqueIds.map((id) => tx.orm.public.Tag.where({ id }).first()),
      );
      for (const tag of tags) {
        if (!tag) throw new NotFoundException('Tag tidak ditemukan');
        if (tag.userId !== idUser) {
          throw new ForbiddenException('Akses ditolak: Tag bukan milik Anda');
        }
      }

      const existingLinks = await Promise.all(
        uniqueIds.map((idTag) =>
          tx.orm.public.AlatBahanTag.where({
            alatBahanId: idItem,
            tagId: idTag,
          }).first(),
        ),
      );

      const alreadyAttached = new Set<number>();

      for (const link of existingLinks) {
        if (link) alreadyAttached.add(link.tagId);
      }

      const toAttach = uniqueIds.filter((id) => !alreadyAttached.has(id));
      if (toAttach.length === 0) {
        throw new ConflictException('Tag sudah terpasang pada item');
      }

      return tx.orm.public.AlatBahan.where({ id: idItem }).update({
        // alatBahanTag: (t) =>
        //   t.connect(toAttach.map((idTag) => ({ idItem, idTag }))),
        alatBahanTag: (t) =>
          t.connect(toAttach.map((tagId) => ({ alatBahanId: idItem, tagId }))),
      });
    });
  }

  async detachFromItem(idTags: number[], idItem: string, idUser: number) {
    const uniqueIds = [...new Set(idTags)];

    return this.prisma.db.transaction(async (tx) => {
      const item = await tx.orm.public.AlatBahan.where({
        id: idItem,
      }).first();
      if (!item) throw new NotFoundException('Alat/bahan tidak ditemukan');
      if (item.idUser !== idUser) throw new ForbiddenException('Akses ditolak');

      // Semua tag harus ada dan milik user yang sama
      const tags = await Promise.all(
        uniqueIds.map((id) => tx.orm.public.Tag.where({ id }).first()),
      );
      for (const tag of tags) {
        if (!tag) throw new NotFoundException('Tag tidak ditemukan');
        if (tag.userId !== idUser) {
          throw new ForbiddenException('Akses ditolak: Tag bukan milik Anda');
        }
      }

      // Cek link yang benar-benar terpasang pada item ini
      const existingLinks = await Promise.all(
        uniqueIds.map((idTag) =>
          tx.orm.public.AlatBahanTag.where({
            alatBahanId: idItem,
            tagId: idTag,
          }).first(),
        ),
      );

      const attached = new Set<number>();
      for (const link of existingLinks) {
        if (link) attached.add(link.tagId);
      }

      const toDetach = uniqueIds.filter((id) => attached.has(id));
      if (toDetach.length === 0) {
        throw new NotFoundException('Tag tidak terpasang pada item');
      }

      return tx.orm.public.AlatBahan.where({ id: idItem }).update({
        alatBahanTag: (t) =>
          t.disconnect(
            toDetach.map((idTag) => ({ alatBahanId: idItem, tagId: idTag })),
          ),
      });
    });
  }
}
