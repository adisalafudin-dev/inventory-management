import "dotenv/config";
import { Temporal } from "@js-temporal/polyfill";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../src/generated/prisma/contract.d.ts";
import contractJson from "../src/generated/prisma/contract.json" with { type: "json" };

/**
 * Typed Prisma 8 client.
 *
 * The type (`Contract`) and the runtime value (`contractJson`) come from the
 * generated artifacts in src/generated/prisma, produced by `prisma contract emit`.
 *
 * Example:
 *   import { db } from "./db";
 *   const user = await db.orm.User.where({ email: "x@y.com" }).first();
 */

// Prisma `*temporal` codecs (e.g. log_mutasi.tanggal) read a global `Temporal`
// at runtime and fail with RUNTIME.TEMPORAL_UNAVAILABLE without it. Node does
// not ship `Temporal` yet, so expose the polyfill on globalThis.
(globalThis as { Temporal?: typeof Temporal }).Temporal = Temporal;

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});
