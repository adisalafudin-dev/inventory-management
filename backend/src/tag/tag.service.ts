import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const existingTags = await this.prisma.db.orm.public.Tag.where({}).all();
    const duplicate = existingTags.some(
      (tag) =>
        tag.namaTag.toLowerCase() === createTagDto.namaTag.trim().toLowerCase(),
    );

    if (duplicate) {
      throw new ConflictException('Tag dengan nama tersebut sudah ada');
    }

    return this.prisma.db.orm.public.Tag.create({
      namaTag: createTagDto.namaTag.trim(),
    });
  }

  async findAll() {
    return this.prisma.db.orm.public.Tag.orderBy((tag) =>
      tag.namaTag.asc(),
    ).all();
  }

  async findOne(id: number) {
    const tag = await this.prisma.db.orm.public.Tag.where({ id }).first();
    if (!tag) throw new NotFoundException('Tag tidak ditemukan');

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const current = await this.findOne(id);
    const namaTag = updateTagDto.namaTag?.trim();

    if (namaTag && namaTag.toLowerCase() !== current.namaTag.toLowerCase()) {
      const existingTags = await this.prisma.db.orm.public.Tag.where({}).all();
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.db.orm.public.Tag.where({ id }).delete();
  }

  async getTagsForItem(idItem: string) {
    const item = await this.prisma.db.orm.public.AlatBahan.where({
      id: idItem,
    }).first();
    if (!item) throw new NotFoundException('Alat/bahan tidak ditemukan');

    return this.prisma.db.orm.public.ItemTag.where({ idItem })
      .include('tag')
      .all();
  }

  async getItemsForTag(idTag: number) {
    await this.findOne(idTag);

    return this.prisma.db.orm.public.ItemTag.where({ idTag })
      .include('alatBahan')
      .all();
  }

  async attachToItem(idTags: number[], idItem: string) {
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

      const tags = await Promise.all(
        uniqueIds.map((id) => tx.orm.public.Tag.where({ id }).first()),
      );

      if (tags.some((tag) => !tag)) {
        throw new NotFoundException('Tag tidak ditemukan');
      }

      const existingLinks = await Promise.all(
        uniqueIds.map((idTag) =>
          tx.orm.public.ItemTag.where({ idItem, idTag }).first(),
        ),
      );

      const alreadyAttached = new Set<number>();

      for (const link of existingLinks) {
        if (link) alreadyAttached.add(link.idTag);
      }

      const toAttach = uniqueIds.filter((id) => !alreadyAttached.has(id));
      if (toAttach.length === 0) {
        throw new ConflictException('Tag sudah terpasang pada item');
      }

      return tx.orm.public.AlatBahan.where({ id: idItem }).update({
        itemTags: (t) =>
          t.connect(toAttach.map((idTag) => ({ idItem, idTag }))),
      });
    });
  }

  async detachFromItem(idTags: number[], idItem: string) {
    const uniqueIds = [...new Set(idTags)];

    return this.prisma.db.transaction(async (tx) => {
      const links = await Promise.all(
        uniqueIds.map((idTag) =>
          tx.orm.public.ItemTag.where({ idItem, idTag }).first(),
        ),
      );

      const attached = new Set<number>();
      for (const link of links) {
        if (link) attached.add(link.idTag);
      }

      const toDetach = uniqueIds.filter((id) => attached.has(id));
      if (toDetach.length === 0) {
        throw new NotFoundException('Tag tidak terpasang pada item');
      }

      return tx.orm.public.AlatBahan.where({ id: idItem }).update({
        itemTags: (t) =>
          t.disconnect(toDetach.map((idTag) => ({ idItem, idTag }))),
      });
    });
  }
}
