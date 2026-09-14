#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/77d6b1e2f9ebd26b8bea46b59cb6a11ac20b354ddaee7b8242bdc596deb4150a/contract';
import endContract from '../../snapshots/77d6b1e2f9ebd26b8bea46b59cb6a11ac20b354ddaee7b8242bdc596deb4150a/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'alat_bahan',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('idKategori', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('idLokasi', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('idUser', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('kondisi', 'text', {
            notNull: true,
            default: lit('BAIK'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('kuantitas', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('namaBarang', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'alat_bahan_kondisi_check_9a0cb098',
            "\"kondisi\" IN ('BAIK', 'KARATAN', 'RUSAK')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'item_tags',
        columns: [
          col('idItem', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('idTag', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['idItem', 'idTag'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'kategori',
        columns: [
          col('deskripsi', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('namaKategori', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'log_mutasi',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('idItem', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jumlahPerubahan', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('keterangan', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('tanggal', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('tipe', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('log_mutasi_tipe_check_3f24b669', "\"tipe\" IN ('IN', 'OUT', 'AUDIT')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'lokasiPenyimpanan',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('namaLokasi', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('spesifikLetak', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tag',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('namaTag', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tag',
        constraint: 'tag_namaTag_key',
        columns: ['namaTag'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'alat_bahan',
        index: 'alat_bahan_idKategori_idx_f73ca8ee',
        columns: ['idKategori'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'alat_bahan',
        index: 'alat_bahan_idLokasi_idx_1d609b10',
        columns: ['idLokasi'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'alat_bahan',
        index: 'alat_bahan_idUser_idx_6acaa521',
        columns: ['idUser'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item_tags',
        index: 'item_tags_idItem_idx_6ba85971',
        columns: ['idItem'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item_tags',
        index: 'item_tags_idTag_idx_8040406a',
        columns: ['idTag'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'log_mutasi',
        index: 'log_mutasi_idItem_idx_6ba85971',
        columns: ['idItem'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'alat_bahan',
        foreignKey: {
          name: 'alat_bahan_idKategori_fkey',
          columns: ['idKategori'],
          references: { schema: 'public', table: 'kategori', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'alat_bahan',
        foreignKey: {
          name: 'alat_bahan_idLokasi_fkey',
          columns: ['idLokasi'],
          references: { schema: 'public', table: 'lokasiPenyimpanan', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'alat_bahan',
        foreignKey: {
          name: 'alat_bahan_idUser_fkey',
          columns: ['idUser'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item_tags',
        foreignKey: {
          name: 'item_tags_idItem_fkey',
          columns: ['idItem'],
          references: { schema: 'public', table: 'alat_bahan', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item_tags',
        foreignKey: {
          name: 'item_tags_idTag_fkey',
          columns: ['idTag'],
          references: { schema: 'public', table: 'tag', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'log_mutasi',
        foreignKey: {
          name: 'log_mutasi_idItem_fkey',
          columns: ['idItem'],
          references: { schema: 'public', table: 'alat_bahan', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
