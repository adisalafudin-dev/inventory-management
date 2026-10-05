#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5c45b139a356b7e6c0cb39692ecf311c33b3c8bdf83f51de36db6438af7c0dad/contract';
import endContract from '../../snapshots/5c45b139a356b7e6c0cb39692ecf311c33b3c8bdf83f51de36db6438af7c0dad/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8d66580cd9d57f7e4855bb5ae861c2674a5412fe693a899ebb8c840ad09ca955/contract';
import startContract from '../../snapshots/8d66580cd9d57f7e4855bb5ae861c2674a5412fe693a899ebb8c840ad09ca955/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('googleId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dropNotNull({ schema: 'public', table: 'user', column: 'password' }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_googleId_key',
        columns: ['googleId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
