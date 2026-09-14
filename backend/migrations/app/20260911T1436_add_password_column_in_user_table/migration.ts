#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/616cc8bd65cd8b0c33eb0c60924bcfc71bfaaca515e385cb3f04ec4b97189f04/contract';
import endContract from '../../snapshots/616cc8bd65cd8b0c33eb0c60924bcfc71bfaaca515e385cb3f04ec4b97189f04/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/77d6b1e2f9ebd26b8bea46b59cb6a11ac20b354ddaee7b8242bdc596deb4150a/contract';
import startContract from '../../snapshots/77d6b1e2f9ebd26b8bea46b59cb6a11ac20b354ddaee7b8242bdc596deb4150a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-password', {
        check: () => placeholder('backfill-user-password:check'),
        run: () => placeholder('backfill-user-password:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
