#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5cb522cf1d1403f6b2dc85cb65affb8a33f6c42b2e0636a1b3f8c0e7932aa699/contract';
import endContract from '../../snapshots/5cb522cf1d1403f6b2dc85cb65affb8a33f6c42b2e0636a1b3f8c0e7932aa699/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/616cc8bd65cd8b0c33eb0c60924bcfc71bfaaca515e385cb3f04ec4b97189f04/contract';
import startContract from '../../snapshots/616cc8bd65cd8b0c33eb0c60924bcfc71bfaaca515e385cb3f04ec4b97189f04/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'kategori',
        column: col('idUser', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.setNotNull({
        schema: 'public',
        table: 'kategori',
        column: 'idUser',
      }),
      this.addColumn({
        schema: 'public',
        table: 'lokasiPenyimpanan',
        column: col('idUser', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.setNotNull({
        schema: 'public',
        table: 'lokasiPenyimpanan',
        column: 'idUser',
      }),
      this.createIndex({
        schema: 'public',
        table: 'kategori',
        index: 'kategori_idUser_idx_6acaa521',
        columns: ['idUser'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lokasiPenyimpanan',
        index: 'lokasiPenyimpanan_idUser_idx_6acaa521',
        columns: ['idUser'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'kategori',
        foreignKey: {
          name: 'kategori_idUser_fkey',
          columns: ['idUser'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lokasiPenyimpanan',
        foreignKey: {
          name: 'lokasiPenyimpanan_idUser_fkey',
          columns: ['idUser'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
